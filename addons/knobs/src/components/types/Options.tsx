import React, { FunctionComponent } from 'react';
import PropTypes from 'prop-types';
import ReactSelect from 'react-select';
import { ValueType } from 'react-select/lib/types';
import { styled } from '@storybook/theming';

import RadiosType from './Radio';
import CheckboxesType from './Checkboxes';

// TODO: Apply the Storybook theme to react-select

export type OptionsKnobOptionsDisplay =
  | 'radio'
  | 'inline-radio'
  | 'check'
  | 'inline-check'
  | 'select'
  | 'multi-select';

export interface OptionsKnobOptions {
  display?: OptionsKnobOptionsDisplay;
}

export interface OptionsTypeKnob<T> {
  name: string;
  value: T;
  defaultValue: T;
  options: OptionsTypeOptionsProp<T>;
  optionsObj: OptionsKnobOptions;
}

export interface OptionsTypeOptionsProp<T> {
  [key: string]: T;
}

export interface OptionsTypeProps<T> {
  knob: OptionsTypeKnob<T>;
  display: OptionsKnobOptionsDisplay;
  onChange: (value: T) => T;
}

// : React.ComponentType<ReactSelectProps>
const OptionsSelect = styled(ReactSelect)({
  width: '100%',
  maxWidth: '300px',
  color: 'black',
});

type ReactSelectOnChangeFn<OptionType = OptionsSelectValueItem> = (
  value: ValueType<OptionType>
) => void;

interface OptionsSelectValueItem {
  value: any;
  label: string;
}

const serialize: { <T>(value: T): T } = value => value;
const deserialize: { <T>(value: T): T } = value => value;

const OptionsType: FunctionComponent<OptionsTypeProps<any>> & {
  serialize: typeof serialize;
  deserialize: typeof deserialize;
} = props => {
  const { knob, onChange } = props;
  const { display } = knob.optionsObj;

  if (display === 'check' || display === 'inline-check') {
    const isInline = display === 'inline-check';
    return <CheckboxesType {...props} isInline={isInline} />;
  }

  if (display === 'radio' || display === 'inline-radio') {
    const isInline = display === 'inline-radio';
    return <RadiosType {...props} isInline={isInline} />;
  }

  if (display === 'select' || display === 'multi-select') {
    const options: OptionsSelectValueItem[] = Object.keys(knob.options).map(key => ({
      value: knob.options[key],
      label: key,
    }));

    const isMulti = display === 'multi-select';
    const optionsIndex = options.findIndex(i => i.value === knob.value);
    let defaultValue: typeof options | typeof options[0] = options[optionsIndex];
    let handleChange: ReactSelectOnChangeFn = (e: OptionsSelectValueItem) => onChange(e.value);

    if (isMulti) {
      defaultValue = options.filter(i => knob.value.includes(i.value));
      handleChange = (values: OptionsSelectValueItem[]) => onChange(values.map(item => item.value));
    }

    return (
      <OptionsSelect
        value={defaultValue}
        options={options}
        isMulti={isMulti}
        onChange={handleChange}
      />
    );
  }

  return null;
};

OptionsType.defaultProps = {
  knob: {} as any,
  display: 'select',
  onChange: value => value,
};

OptionsType.propTypes = {
  // TODO: remove `any` once DefinitelyTyped/DefinitelyTyped#31280 has been resolved
  knob: PropTypes.shape({
    name: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
    options: PropTypes.object,
  }) as any,
  display: PropTypes.oneOf<OptionsKnobOptionsDisplay>([
    'radio',
    'inline-radio',
    'check',
    'inline-check',
    'select',
    'multi-select',
  ]),
  onChange: PropTypes.func,
};

OptionsType.serialize = serialize;
OptionsType.deserialize = deserialize;

export default OptionsType;
