import '##/components/SelectComponents/Select.css';

import { IconClose } from '@consta/icons/IconClose';
import { IconSelect } from '@consta/icons/IconSelect';
import React, { forwardRef, useRef } from 'react';

import { usePropsHandler } from '##/components/EventInterceptor/usePropsHandler';
import { cnSelect } from '##/components/SelectComponentsCanary/cnSelect';
import {
  defaultlabelForCreate,
  defaultLabelForEmptyItems,
  defaultlabelForNotFound,
  getInputWidth,
} from '##/components/SelectComponentsCanary/helpers';
import { SelectContainer } from '##/components/SelectComponentsCanary/SelectContainer';
import { SelectDropdown } from '##/components/SelectComponentsCanary/SelectDropdown';
import { SelectItem } from '##/components/SelectComponentsCanary/SelectItem';
import { SelectValueTag } from '##/components/SelectComponentsCanary/SelectValueTag';
import {
  defaultPropForm,
  defaultPropSize,
  defaultPropView,
} from '##/components/SelectComponentsCanary/types';
import { useSelect } from '##/components/SelectComponentsCanary/useSelect';
import { useForkRef } from '##/hooks/useForkRef';
import { isNotNil } from '##/utils/type-guards';

import { Text } from '../Text';
import {
  ComboboxComponent,
  ComboboxProps,
  DefaultGroup,
  DefaultItem,
  isMultipleParams,
  isNotMultipleParams,
  PropRenderItem,
  PropRenderValue,
  withDefaultGetters,
} from './helpers';

export const COMPONENT_NAME = 'Combobox' as const;

const ComboboxRender = <
  ITEM = DefaultItem,
  GROUP = DefaultGroup,
  MULTIPLE extends boolean = false,
>(
  props: ComboboxProps<ITEM, GROUP, MULTIPLE>,
  ref: React.Ref<HTMLDivElement>,
) => {
  const defaultDropdownRef = useRef<HTMLDivElement | null>(null);
  const controlInnerRef = useRef<HTMLDivElement>(null);
  const helperInputFakeElement = useRef<HTMLDivElement>(null);
  const controlRef = useRef<HTMLDivElement | null>(null);

  const {
    placeholder,
    onBlur,
    onFocus,
    items,
    onChange,
    value,
    disabled,
    ariaLabel,
    id,
    required,
    dropdownRef,
    form = defaultPropForm,
    view = defaultPropView,
    size = defaultPropSize,
    dropdownClassName,
    name,
    groups = [],
    getItemLabel,
    getItemKey,
    getItemGroupKey,
    getItemDisabled,
    getGroupKey,
    getGroupLabel,
    renderItem,
    allSelectedAllLabel = 'Все',
    searchValue: searchValueProp,
    renderValue: renderValueProp,
    onCreate,
    inputRef: inputRefProp,
    labelForNotFound = defaultlabelForNotFound,
    labelForCreate = defaultlabelForCreate,
    labelForEmptyItems = defaultLabelForEmptyItems,
    searchFunction,
    selectAll,
    isLoading,
    multiple = false,
    style,
    dropdownForm = 'default',
    virtualScroll,
    onScrollToBottom,
    onDropdownOpen,
    onSearchValueChange,
    dropdownOpen,
    ignoreOutsideClicksRefs,
    ...otherProps
  } = usePropsHandler(COMPONENT_NAME, withDefaultGetters(props), controlRef);

  const {
    getKeyProps,
    getOptionProps,
    isOpen,
    visibleItems,
    isFocused,
    handleInputFocus,
    handleInputBlur,
    handleToggleDropdown,
    inputRef,
    handleInputClick,
    handleInputChange,
    searchValue,
    clearValue,
    getHandleRemoveValue,
    notFound,
    hasItems,
    optionsRefs,
    allItemsSelected,
  } = useSelect({
    items,
    groups,
    value,
    onChange,
    selectAll,
    dropdownRef: defaultDropdownRef,
    controlRef,
    disabled,
    getItemLabel,
    getItemKey,
    getGroupKey,
    searchValue: searchValueProp,
    getItemGroupKey,
    getItemDisabled,
    multiple,
    onBlur,
    onFocus,
    onCreate,
    searchFunction,
    onDropdownOpen,
    onSearchValueChange,
    dropdownOpen,
    ignoreOutsideClicksRefs,
  });

  const inputId = id ? `${id}-input` : id;

  const renderItemDefault: PropRenderItem<ITEM> = (props) => {
    const { item, active, hovered, onClick, onMouseEnter, ref } = props;

    return (
      <SelectItem
        label={getItemLabel(item)}
        active={active}
        hovered={hovered}
        multiple={multiple}
        size={size}
        indent={dropdownForm === 'round' ? 'increased' : 'normal'}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        disabled={getItemDisabled(item)}
        ref={ref}
      />
    );
  };

  const renderValueDefaultMultiple: PropRenderValue<ITEM> = ({
    item,
    handleRemove,
  }) => {
    return (
      <SelectValueTag
        label={getItemLabel(item)}
        key={getItemKey(item)}
        size={size}
        disabled={disabled || getItemDisabled(item)}
        handleRemove={handleRemove}
      />
    );
  };

  const renderValueDefaultNotMultiple: PropRenderValue<ITEM> = (props) => {
    const valueLable = getItemLabel(props.item);

    return (
      <span className={cnSelect('ControlValue')} title={valueLable}>
        {valueLable}
      </span>
    );
  };

  const renderValue =
    renderValueProp ||
    (multiple ? renderValueDefaultMultiple : renderValueDefaultNotMultiple);

  const inputRefForRender = useForkRef([inputRef, inputRefProp]);

  const renderControlValue = () => {
    const width = multiple
      ? getInputWidth(controlInnerRef, helperInputFakeElement)
      : undefined;
    return (
      <>
        {isMultipleParams(props) &&
          Array.isArray(props.value) &&
          props.value.map((item) =>
            renderValue({ item, handleRemove: getHandleRemoveValue(item) }),
          )}
        {isNotMultipleParams(props) &&
          isNotNil(props.value) &&
          renderValue({ item: props.value })}
        {(!isNotNil(value) || (Array.isArray(value) && value.length === 0)) &&
          !searchValue &&
          placeholder && (
            <span className={cnSelect('Placeholder')} title="placeholder">
              {placeholder}
            </span>
          )}
        <input
          {...getKeyProps()}
          type="text"
          name={name}
          id={inputId}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          aria-label={ariaLabel}
          onChange={handleInputChange}
          ref={inputRefForRender}
          className={cnSelect('Input', {
            size,
            hide: !multiple && isNotNil(value),
            multiple,
          })}
          value={searchValue}
          style={{ width }}
        />
      </>
    );
  };

  const renderValueList = () => {
    if (allItemsSelected) {
      return (
        <Text size={size} className={cnSelect('SelectAll')}>
          {allSelectedAllLabel}
        </Text>
      );
    }
    if (multiple) {
      return (
        <div className={cnSelect('ControlValue')}>{renderControlValue()}</div>
      );
    }
    return renderControlValue();
  };

  return (
    <>
      <SelectContainer
        focused={isFocused}
        disabled={disabled}
        size={size}
        view={view}
        required={required}
        form={form}
        multiple={multiple}
        ref={ref}
        type="combobox"
        style={style}
        id={inputId}
        {...otherProps}
      >
        <div
          className={cnSelect('Control', { hasInput: true })}
          ref={controlRef}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          id={id}
        >
          <div
            className={cnSelect('ControlInner')}
            onClick={handleInputClick}
            role="button"
            ref={controlInnerRef}
            aria-hidden="true"
          >
            <div className={cnSelect('ControlValueContainer')}>
              {renderValueList()}
            </div>
          </div>
          <span className={cnSelect('Indicators')}>
            {isNotNil(value) && (
              <button
                type="button"
                onClick={clearValue}
                tabIndex={-1}
                className={cnSelect('ClearIndicator')}
              >
                <IconClose
                  size="xs"
                  className={cnSelect('ClearIndicatorIcon')}
                />
              </button>
            )}
            <span className={cnSelect('Delimiter')} />
            <button
              type="button"
              className={cnSelect('IndicatorsDropdown')}
              tabIndex={-1}
              onClick={handleToggleDropdown}
            >
              <IconSelect
                size="xs"
                className={cnSelect('DropdownIndicatorIcon')}
              />
            </button>
          </span>
        </div>
        <div
          className={cnSelect('HelperInputFakeElement')}
          ref={helperInputFakeElement}
        >
          {searchValue}
        </div>
      </SelectContainer>
      <SelectDropdown
        isOpen={isOpen}
        size={size}
        controlRef={controlRef}
        getOptionProps={getOptionProps}
        dropdownRef={useForkRef([dropdownRef, defaultDropdownRef])}
        form={dropdownForm}
        className={dropdownClassName}
        renderItem={renderItem || renderItemDefault}
        getGroupLabel={getGroupLabel}
        visibleItems={visibleItems}
        labelForNotFound={labelForNotFound}
        labelForCreate={labelForCreate}
        isLoading={isLoading}
        labelForEmptyItems={labelForEmptyItems}
        notFound={notFound}
        hasItems={hasItems}
        itemsRefs={optionsRefs}
        virtualScroll={virtualScroll}
        onScrollToBottom={onScrollToBottom}
        style={
          typeof style?.zIndex === 'number'
            ? { zIndex: style.zIndex + 1 }
            : undefined
        }
      />
    </>
  );
};

export const Combobox = forwardRef(ComboboxRender) as ComboboxComponent;
