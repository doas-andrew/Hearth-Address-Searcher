import React, { useState } from 'react'
import { Table } from 'react-bootstrap'
import { IoIosArrowUp as UpArrow, IoIosArrowDown as DownArrow } from 'react-icons/io'
import { propertyHeaders } from '../constants'


export default function DataGrid(props) {
    const [order, setOrder]       = useState(-1)  // ASCending = -1, DESCending = 1
    const [sort, setSort]         = useState('property_id')

	const compare = (a,b) => {
		if      (a[sort] < b[sort]) return order
		else if (a[sort] > b[sort]) return order * -1
		else                        return 0 
	}

	const handleColumnClick = column => {
		if (column === sort) {
			setOrder(order * -1)
		} else  {
			setOrder(-1)
			setSort(column)
		}
	}

	const iteratePage = num => {
		props.query.pageIndex += num
		props.setQuery({...props.query})
	}

	const renderPageButtons = () => {
		const currentPage = props.query.pageIndex + 1
		const lastPage = Math.ceil(props.total / props.query.pageSize)
		return (
			<div className='button-container'>
				<div>Page {currentPage} of {lastPage}</div>
				<button className='button-prev' onClick={() => iteratePage(-1)} disabled={currentPage - 1 === 0}>Previous</button>
				<button className='button-next' onClick={() => iteratePage( 1)} disabled={currentPage === lastPage}>Next</button>
			</div>
		)
	}

	const formatter = new Intl.NumberFormat('en-US', {
	  style: 'currency',
	  currency: 'USD',
	  maximumFractionDigits: 0
	})

	return (
		<div className='datagrid-container'>
			{renderPageButtons()}
			<Table striped hover bordered className='datagrid'>
				<thead className='datagrid-headers'>
					<tr>
						{ propertyHeaders.map((header, index) => {
							let icon = null
							let clickAction = null
							let className = 'header-nosort'

							if (header.sortable) {
								clickAction = () => handleColumnClick(header.column)
								className = 'header-sort'

								if (header.column === sort) {
									className += ' active-col'
									if (order === -1)
										icon = <UpArrow className='svg-align' />
									else
										icon = <DownArrow className='svg-align' />
								}
							}

							return (
								<th key={index} className={className} onClick={clickAction}>
									{header.display}&nbsp;{icon}
									<div className='bottom'></div>
								</th>
							)
						})}
					</tr>
				</thead>
				<tbody className='datagrid-rows'>
					{ props.data.sort(compare).map((d, i) =>
						<tr key={i} className='datagrid-row'>
							<td>{ d.property_id   }</td>
							<td>{ d.property_type }</td>
							<td>{ d.address       }</td>
							<td>{ d.city          }</td>
							<td>{ d.state_abbrev  }</td>
							<td>{ d.zip           }</td>
							<td>{ formatter.format(d.price) }</td>
							<td>{ d.square_feet   }</td>
							<td>{ d.beds          }</td>
							<td>{ d.baths         }</td>
							<td>{ d.year_built    }</td>
							<td>
								<a target='_blank' href={d.url}>
									<button className='datagrid-info-button'>More&nbsp;info</button>
								</a>
							</td>
						</tr>
					)}
				</tbody>
			</Table>
			{renderPageButtons()}
		</div>
	)
}
