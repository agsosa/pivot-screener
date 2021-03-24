import React from 'react';
import { Space, Button, Badge } from 'antd';
import './Table.css';
import { PropTypes } from 'prop-types';
import { capitalizeFirstLetter } from '../../../../lib/Helpers';
import SocketStatus from '../../../misc/SocketStatus';

const FiltersMenu = ({ tickersCount, market, timeframe, onSaveFilters, onLoadFilters, onClearFilters }) => (
	<>
		<Space>
			<h1>
				{capitalizeFirstLetter(market)} / {capitalizeFirstLetter(timeframe)}
			</h1>
			<Badge className='badge' count={tickersCount} />
			<SocketStatus className='socket-status' />
		</Space>
		<p className='filter-hint'>You can filter, short and move any column. The data is updated automatically.</p>
		<Space>
			<Button onClick={onSaveFilters}>Save Filters</Button>
			<Button onClick={onLoadFilters}>Load Saved Filters</Button>
			<Button onClick={onClearFilters}>Clear Filters</Button>
		</Space>
	</>
);

FiltersMenu.propTypes = {
	tickersCount: PropTypes.number.isRequired,
	market: PropTypes.string.isRequired,
	timeframe: PropTypes.string.isRequired,
	onSaveFilters: PropTypes.func.isRequired,
	onLoadFilters: PropTypes.func.isRequired,
	onClearFilters: PropTypes.func.isRequired,
};

export default FiltersMenu;
