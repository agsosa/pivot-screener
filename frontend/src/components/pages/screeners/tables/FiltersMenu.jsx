import * as React from 'react';
import { Space, Button, Badge, message } from 'antd';
import './Table.css';
import { PropTypes } from 'prop-types';
import { capitalizeFirstLetter } from '../../../../lib/Helpers';
import SocketStatus from '../../../misc/SocketStatus';
import { useMst } from '../../../../models/Root';

const FiltersMenu = ({ screenerType, gridApi, tickersCount, market, timeframe }) => {
	const [filtersEnabled, setFiltersEnabled] = React.useState(false);

	const { camTableFilters, cprTableFilters, setCprTableFilters, setCamTableFilters } = useMst((store) => ({
		camTableFilters: store.camTableFilters,
		cprTableFilters: store.cprTableFilters,
		setCprTableFilters: store.setCprTableFilters,
		setCamTableFilters: store.setCamTableFilters,
	}));

	let setTableFilters;
	let getTableFilters;

	switch (screenerType.toLowerCase()) {
		case 'cam':
			getTableFilters = camTableFilters;
			setTableFilters = setCamTableFilters;
			break;
		case 'cpr':
			getTableFilters = cprTableFilters;
			setTableFilters = setCprTableFilters;
			break;
		default:
			getTableFilters = null;
			setTableFilters = null;
	}

	const onFilterChanged = () => {
		setFiltersEnabled(gridApi.isAnyFilterPresent());
	};

	React.useEffect(() => {
		gridApi.addEventListener('filterChanged', onFilterChanged);

		return () => {
			gridApi.removeEventListener('filterChanged', onFilterChanged);
		};
	}, [gridApi]);

	const saveFilters = () => {
		if (gridApi) {
			const filterModel = gridApi.getFilterModel();
			if (setTableFilters) setTableFilters(filterModel);
			message.success('Filters saved');
		} else {
			message.success('The table is not ready');
		}
	};

	const loadFilters = () => {
		if (gridApi) {
			if (getTableFilters) {
				gridApi.setFilterModel(getTableFilters);
				message.success('Filters applied');
			} else {
				message.error('No saved filters found');
			}
		} else {
			message.success('The table is not ready');
		}
	};

	const clearFilters = () => {
		if (gridApi) {
			gridApi.setFilterModel(null);
		} else {
			message.success('The table is not ready');
		}
	};

	return (
		<div>
			<Space>
				<h1>
					{capitalizeFirstLetter(market)} / {capitalizeFirstLetter(timeframe)}
				</h1>
				<Badge className='badge' count={tickersCount} />
				<SocketStatus className='socket-status' />
			</Space>
			<p className='filter-hint'>You can filter, short and move any column. The data is updated automatically.</p>
			<Space>
				<Button onClick={saveFilters}>Save Filters</Button>
				<Button onClick={loadFilters}>Load Saved Filters</Button>
				<Button onClick={clearFilters}>Clear Filters</Button>
			</Space>
			{filtersEnabled && <p className='using-filters'>* Using Filters *</p>}
		</div>
	);
};

FiltersMenu.propTypes = {
	tickersCount: PropTypes.number.isRequired,
	market: PropTypes.string.isRequired,
	timeframe: PropTypes.string.isRequired,
	screenerType: PropTypes.string.isRequired,
	gridApi: PropTypes.shape({
		setFilterModel: PropTypes.func.isRequired,
		getFilterModel: PropTypes.func.isRequired,
		isAnyFilterPresent: PropTypes.func.isRequired,
		addEventListener: PropTypes.func.isRequired,
		removeEventListener: PropTypes.func.isRequired,
	}).isRequired,
};

export default FiltersMenu;
