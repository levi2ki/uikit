import './ComboboxStories.css';

import React, { useState } from 'react';
import { boolean, select, text } from '@storybook/addon-knobs';

import { groups, Item, items, myData, MyGroup, myGroup, MyItem } from '../__mocks__/data.mock';
import { cn } from '../../../utils/bem';
import { createMetadata, createStory } from '../../../utils/storybook';
import {
  defaultPropForm,
  defaultPropSize,
  defaultPropView,
  propForm,
  propView,
} from '../../SelectComponents/types';
import { Combobox } from '../Combobox';

const cnComboboxStories = cn('ComboboxStories');

// import mdx from './Select.docs.mdx';

const getKnobs = () => ({
  disabled: boolean('disabled', false),
  size: select('size', ['m', 's', 'l'], defaultPropSize),
  view: select('view', propView, defaultPropView),
  form: select('form', propForm, defaultPropForm),
  placeholder: text('placeholder', 'Placeholder'),
  withGroups: boolean('withGroups', false),
});

export function Playground(): JSX.Element {
  const { size, disabled, view, form, placeholder, withGroups } = getKnobs();
  const [value, setValue] = useState<Item | null>(null);
  const [valueMultiple, setValueMultiple] = useState<Item[] | null>(null);
  const multiple = boolean('multiple', false);

  if (multiple) {
    return (
      <Combobox
        key="multiple"
        size={size}
        disabled={disabled}
        view={view}
        form={form}
        placeholder={placeholder}
        items={items}
        value={valueMultiple}
        onChange={({ value }) => setValueMultiple(value)}
        groups={withGroups ? groups : []}
        multiple
      />
    );
  }
  return (
    <Combobox
      key="not-multiple"
      size={size}
      disabled={disabled}
      view={view}
      form={form}
      placeholder={placeholder}
      items={items}
      value={value}
      onChange={({ value }) => setValue(value)}
      groups={withGroups ? groups : []}
      multiple={false}
    />
  );
}

const getItemGroup = (item: MyItem) => item.group;
const getItemName = (item: MyItem) => item.name;
const getItemDisabled = () => false;
const getGroup = (group: MyGroup) => group;

export const WithRender = createStory(
  () => {
    const { size, disabled, view, form, placeholder, withGroups } = getKnobs();
    const [value, setValue] = useState<MyItem | null>();

    return (
      <Combobox
        size={size}
        disabled={disabled}
        view={view}
        form={form}
        placeholder={placeholder}
        items={myData}
        value={value}
        onChange={({ value }) => setValue(value)}
        groups={withGroups ? myGroup : []}
        renderItem={({ item, active, hovered, onClick, onMouseEnter }) => (
          <div
            className={cnComboboxStories('MyItem', { active, hovered })}
            role="option"
            tabIndex={0}
            aria-selected={active}
            aria-hidden="true"
            onMouseEnter={onMouseEnter}
            onClick={onClick}
          >
            {item.name}
          </div>
        )}
        renderValue={({ item }) => (
          <div>
            <span role="img" aria-label="Panda">
              🐼
            </span>{' '}
            - {item.name}
          </div>
        )}
        getItemDisabled={getItemDisabled}
        getItemKey={getItemName}
        getItemLabel={getItemName}
        getItemGroupKey={getItemGroup}
        getGroupKey={getGroup}
        getGroupLabel={getGroup}
      />
    );
  },
  {
    name: 'со своим списком и заначением',
  },
);

export const WithCreate = createStory(
  () => {
    const { size, disabled, view, form, placeholder, withGroups } = getKnobs();
    const [value, setValue] = useState<Item | null>();
    const [list, setList] = useState<Item[]>(items);
    return (
      <Combobox
        key="not-multiple"
        size={size}
        disabled={disabled}
        view={view}
        form={form}
        placeholder={placeholder}
        items={list}
        value={value}
        onChange={({ value }) => setValue(value)}
        groups={withGroups ? groups : []}
        onCreate={({ label }) => setList([{ label, id: `${label}_${list.length + 1}` }, ...list])}
      />
    );
  },
  {
    name: 'с созданием новой опции',
  },
);

export default createMetadata({
  title: 'Компоненты|/Базовые/Combobox',
  id: 'components/Combobox',
  // parameters: {
  //   docs: {
  //     page: mdx,
  //   },
  //   design: {
  //     type: 'figma',
  //     url: 'https://www.figma.com/file/v9Jkm2GrymD277dIGpRBSH/Consta-UI-Kit?node-id=9701%3A190445',
  //   },
  // },
});
