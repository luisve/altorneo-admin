import React, { useState, useRef, useImperativeHandle, forwardRef } from 'react';
import { SelectType } from '../types/SelectType';


type AutocompleteProps = {
	options: SelectType[];
	onSelect: (selected: SelectType) => void;
};


export interface AutocompleteRef {
	clear: () => void;
}


//const Autocomplete: React.FC<AutocompleteProps> = ({ options, onSelect }) => {
const Autocomplete = forwardRef<AutocompleteRef, AutocompleteProps>(
	({ options, onSelect }, ref) => {


		const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
		const [inputValue, setInputValue] = useState('');
		const [filteredOptions, setFilteredOptions] = useState<SelectType[]>([]);
		const [showDropdown, setShowDropdown] = useState(false);
		const inputRef = useRef<HTMLInputElement>(null);

		useImperativeHandle(ref, () => ({
			clear: () => setInputValue('')
		}));

		const filterOptions = (value: string) => {
			const filtered = options.filter(opt =>
				opt.Label.toLowerCase().includes(value.toLowerCase())
			);
			setFilteredOptions(filtered);
		};


		const handleFocus = () => {
			if (inputRef.current) {
				inputRef.current.select();
			}
			filterOptions(inputValue.toLowerCase());
			setShowDropdown(true);
		};


		const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
			const value = e.target.value;
			setInputValue(value);
			filterOptions(value.toLowerCase());
			setShowDropdown(true);
		};


		const handleSelect = (option: SelectType) => {
			setInputValue(option.Label);
			setShowDropdown(false);
			onSelect(option);
		};


return (
  // 1. Envolvemos todo en un div con position relative de Bootstrap (position-relative)
  <div className="position-relative w-100">
    <input 
      ref={inputRef} 
      type="text" 
      value={inputValue} 
      onFocus={handleFocus} 
      onChange={handleChange} 
      className="form-control"
      onKeyDown={(e) => {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setHighlightedIndex((prev) =>
            prev < filteredOptions.length - 1 ? prev + 1 : 0
          );
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          setHighlightedIndex((prev) =>
            prev > 0 ? prev - 1 : filteredOptions.length - 1
          );
        } else if (e.key === 'Enter' && highlightedIndex >= 0) {			
          e.preventDefault();
          handleSelect(filteredOptions[highlightedIndex]);					
        }
      }}
      onBlur={() => {
        setTimeout(() => {
          setShowDropdown(false);
          setHighlightedIndex(-1);
        }, 100);
      }}
    />

    {showDropdown && filteredOptions.length > 0 && (
      // 2. Usamos clases nativas de Bootstrap 5 para el menú desplegable
      <ul 
        className="dropdown-menu show w-100"
        style={{
          maxHeight: '350px',
          overflowY: 'auto',
          zIndex: 1055 // Z-index superior al del modal estándar de Bootstrap (1055)
        }}
      >
        {filteredOptions.map((option, index) => (
          <li key={index}>
            <button
              type="button"
              onMouseDown={() => handleSelect(option)}
              className={`dropdown-item text-truncate ${index === highlightedIndex ? 'active' : ''}`}
              style={{ cursor: 'pointer' }}
            >
              {option.Label}
            </button>
          </li>
        ))}
      </ul>
    )}
  </div>
);

/*
		return (
			<>
				<input
					ref={inputRef}
					type="text"
					value={inputValue}
					onFocus={handleFocus}
					onChange={handleChange}
					className="form-control"
					onKeyDown={(e) => {
						if (e.key === 'ArrowDown') {
							e.preventDefault();
							setHighlightedIndex((prev) =>
								prev < filteredOptions.length - 1 ? prev + 1 : 0
							);
						} else if (e.key === 'ArrowUp') {
							e.preventDefault();
							setHighlightedIndex((prev) =>
								prev > 0 ? prev - 1 : filteredOptions.length - 1
							);
						} else if (e.key === 'Enter' && highlightedIndex >= 0) {
							e.preventDefault();
							handleSelect(filteredOptions[highlightedIndex]);
						}
					}}
					onBlur={() => {
						setTimeout(() => {
							setShowDropdown(false);
							setHighlightedIndex(-1);
						}, 100);
					}}
				/>
				{
					showDropdown && filteredOptions.length > 0 && (
						<ul
							className="autocomplete-options w-100"
							style={{
								position: 'absolute',
								top: '100%',
								left: 0,
								right: 0,
								backgroundColor: 'white',
								border: '1px solid #ccc',
								maxHeight: '350px',
								overflowY: 'auto',
								margin: 0,
								padding: 0,
								listStyle: 'none',
								zIndex: 1000,
							}}
						>
							{
								filteredOptions.map((option, index) => (
									<li
										key={index}
										onMouseDown={() => handleSelect(option)}
										style={{
											padding: '5px',
											cursor: 'pointer',
											backgroundColor: index === highlightedIndex ? '#eee' : 'white',
											textOverflow: 'ellipsis'
										}}
										className={index === highlightedIndex ? 'autocomplete-option selected' : 'autocomplete-option'}>
										{option.Label}
									</li>
								))
							}
						</ul>
					)
				}
			</>
		);
*/

	}
);


export default Autocomplete;