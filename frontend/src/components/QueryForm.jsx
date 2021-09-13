import React, { useState } from 'react'
import NumberFormat from 'react-number-format'


export default function QueryForm(props) {
    const submitForm = e => {
        e.preventDefault()
        const form = e.target

        props.query.text = form['text'].value

        if (props.useAdvanced) {
            // Beds / Baths
            props.query.beds = form['beds'].value
            props.query.baths = form['baths'].value

            // Price
            props.query.priceMin = form['priceMin'].value ? form['priceMin'].value.replace(/\$|,/g, '') : 0
            props.query.priceMax = form['priceMax'].value ? form['priceMax'].value.replace(/\$|,/g, '') : 0

            // Square Feet
            props.query.squareFeetMin = form['squareFeetMin'].value.replace(/,/g, '')
            props.query.squareFeetMax = form['squareFeetMax'].value.replace(/,/g, '')

            // Year Built
            props.query.yearBuiltMin = form['yearBuiltMin'].value
            props.query.yearBuiltMax = form['yearBuiltMax'].value
        }

        // console.log(props.query)
        props.setQuery({...props.query})
    }

    return (
        <div className='query-container'>
            <form onSubmit={submitForm}>
                <div className='query-initial'>
                    <div className='query-initial-inner'>
                        <div>
                            <input id='text' className='query-general' placeholder='City, State, Zip, etc: "San Fran Condo"'/>
                            <button className='query-submit' type='submit'>Submit</button>
                        </div>
                        <div className='toggle-advanced' onClick={() => props.setUseAdvanced(!props.useAdvanced)}>
                            {(props.useAdvanced ? 'Hide' : 'Show') + ' additional search criteria'}
                        </div>
                    </div>
                </div>
                {props.useAdvanced &&
                    <div>
                        <div className='advanced-container'>
                            <div className='advanced-section'>
                                <div className='price-container'>
                                    Price:
                                    <NumberFormat id='priceMin' className='price-input' prefix="$" thousandSeparator={true} allowNegative={false}/>-
                                    <NumberFormat id='priceMax' className='price-input' prefix="$" thousandSeparator={true} allowNegative={false}/>
                                </div>
                                <div className='b-container'>
                                    Beds:
                                    <NumberFormat id='beds' className='b-input' decimalScale={0} isAllowed={values => values.value === '' || (0 <= values.floatValue && values.floatValue <= 99)}/>
                                    Baths:
                                    <NumberFormat id='baths' className='b-input' isAllowed={values => values.value === '' || (0 <= values.floatValue && values.floatValue <= 99)}/>
                                </div>
                            </div>
                            <div className='advanced-section adv-bot'>
                                <div className='area-container'>
                                    Square feet:
                                    <NumberFormat id='squareFeetMin' className='area-input' thousandSeparator={true} isAllowed={values => values.value === '' || (0 <= values.floatValue && values.floatValue <= 99999)}/>-
                                    <NumberFormat id='squareFeetMax' className='area-input' thousandSeparator={true} isAllowed={values => values.value === '' || (0 <= values.floatValue && values.floatValue <= 99999)}/>
                                </div>
                                <div className='year-container'>
                                    Year built:
                                    <NumberFormat id='yearBuiltMin' className='year-input' decimalScale={0} isAllowed={values => values.value === '' || (0 <= values.floatValue && values.floatValue <= 9999)}/>-
                                    <NumberFormat id='yearBuiltMax' className='year-input' decimalScale={0} isAllowed={values => values.value === '' || (0 <= values.floatValue && values.floatValue <= 9999)}/>
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </form>
        </div>
    )
}
