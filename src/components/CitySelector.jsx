import PropTypes from 'prop-types';

const CitySelector = ({ cities, setCity }) => {
  return (
    <div className="city city-selector">
      <h2>City</h2>
      <select onChange={(e) => setCity(e.target.value)}>
        {cities.map((city) => (
          <option key={city.value} value={city.value}>
            {city.name}
          </option>
        ))}
      </select>
    </div>
  );
};

CitySelector.propTypes = {
  cities: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ).isRequired,
  setCity: PropTypes.func.isRequired,
};

export default CitySelector;
