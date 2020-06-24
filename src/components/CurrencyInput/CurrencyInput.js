import React from 'react';

const CurrencyInput = ({labelName, inputName, selectName, currencyList, handleChangeInput, handleChangeSelect, value}) => {
    return (
        <div className="currency-input">
            <label>{labelName}</label>
            <div>
                <input type="number" onChange={handleChangeInput} name={inputName} value={value} />
                <select name={selectName} onChange={handleChangeSelect}>
                    {currencyList.map(cur => <option value={cur.short_name} key={cur.short_name}>{cur.short_name}</option>)}
                </select>
            </div>
        </div>
    );
};

export default CurrencyInput;