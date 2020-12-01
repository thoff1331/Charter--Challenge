import "./App.css";
import Pagination from "./components/pagination";
import stateOptions from "./data/stateOPtions.json";
import filterOptions from "./data/filterOptions.json";
import React from "react";
class Table extends React.Component {
  constructor() {
    super();

    this.state = {
      allItems: [],
      currentItems: [],
      currentPage: null,
      totalPages: null,
      searchTerm: "",
      genre: null,
      location: null,
    };
  }
  componentDidMount() {
    fetch("https://code-challenge.spectrumtoolbox.com/api/restaurants", {
      headers: {
        Authorization: "Api-Key q3MNxtfep8Gt",
      },
    })
      .then((res) => res.json())
      .then((allItems) => {
        this.setState({
          allItems,
        });
      });
  }
  onChangePage = (data) => {
    const { allItems } = this.state;
    const { currentPage, totalPages, pageLimit } = data;
    const offset = (currentPage - 1) * pageLimit;
    const currentItems = allItems.slice(offset, offset + pageLimit);

    this.setState({ currentPage, currentItems, totalPages });
  };
  tableData = (items) => {
    return items.map((restaurant, index) => {
      return (
        <tr key={index}>
          <td>{restaurant.name}</td>
          <td>{restaurant.address1}</td>
          <td>{restaurant.city}</td>
          <td>{restaurant.state}</td>
          <td>{restaurant.telephone}</td>
          <td>{restaurant.genre}</td>
          <td>{restaurant.attire}</td>
        </tr>
      );
    });
  };
  createHeader = () => {
    let header = [
      "Name",
      "Address",
      "City",
      "State",
      "Phone Number",
      "Genre",
      "Attire",
    ];
    return header.map((row, index) => {
      return <th key={index}>{row.toUpperCase()}</th>;
    });
  };
  editSearchTerm = (e) => {
    this.setState({ searchTerm: e.target.value });
  };
  dynamicSearch = () => {
    return this.state.allItems.filter(
      (name) =>
        name.includes(this.state.searchTerm) ||
        name.city === this.state.searchTerm ||
        name.genre.includes(this.state.searchTerm)
    );
  };
  handleGenreChange = (event) => {
    this.setState({ genre: event.target.value });
  };

  handleLocationChange = (event) => {
    this.setState({ location: event.target.value });
  };
  resetFilters = () => {
    this.setState({
      location: stateOptions[0].label,
      genre: null,
    });
    window.location.reload();
  };
  render() {
    const {
      allItems,
      currentItems,
      currentPage,
      totalPages,
      itemsOnPage,
    } = this.state;
    const totalItems = allItems.length;
    const sortedItems = this.state.allItems.sort(function (a, b) {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    });
    const searched = [];
    const filteredRestaurants = allItems.map((restaurant) => {
      if (
        restaurant.name
          .toUpperCase()
          .includes(this.state.searchTerm.toUpperCase()) ||
        restaurant.city.startsWith(this.state.searchTerm) ||
        restaurant.genre.includes(this.state.searchTerm)
      ) {
        return searched.push(restaurant);
      }
    });
    const genreArray = [];
    const genreFiltered = allItems.map((restaurant) => {
      if (restaurant.genre.includes(this.state.genre)) {
        genreArray.push(restaurant);
      }
    });
    const locationArray = [];
    const locationFiltered = allItems.map((restaurant) => {
      if (restaurant.state === this.state.location) {
        locationArray.push(restaurant);
      }
    });
    const bothFiltersActive = [];

    const bothFilters = allItems.map((restaurant) => {
      if (
        restaurant.state === this.state.location &&
        restaurant.genre.includes(this.state.genre) &&
        restaurant.name.includes(this.state.searchTerm)
      ) {
        bothFiltersActive.push(restaurant);
      }
    });
    const searchAndGenreActive = [];

    const searchAndGenre = allItems.map((restaurant) => {
      if (
        restaurant.genre.includes(this.state.genre) &&
        restaurant.name.includes(this.state.searchTerm)
      ) {
        searchAndGenreActive.push(restaurant);
      }
    });

    if (totalItems === 0) return null;
    const headerClass = [
      "text-dark py-2 pr-4 m-0",
      currentPage ? "border-gray border-right" : "",
    ]
      .join(" ")
      .trim();

    return (
      <div className="pageContainer">
        <div className="row d-flex flex-row py-5">
          <div className="w-100 px-4 py-5 d-flex flex-row flex-wrap align-items-center justify-content-between">
            <div className="d-flex flex-row py-4 align-items-center"></div>
          </div>
          <h1 className="title">Choose A Restaurant</h1>
          <div className="restaurantCount">
            <h4 className={headerClass}>
              <strong>{totalItems}</strong> Restaurants to Choose From
            </h4>
          </div>

          <div className="search">
            <input
              value={this.state.searchTerm}
              onChange={this.editSearchTerm}
              placeholder="Search by Name,City, or Genre"
            />
          </div>
          <div className="filter-form">
            <div className="filters">
              <label>Select A State </label>
              <select
                value={this.state.location || ""}
                name={this.state.location}
                id={this.state.location}
                onChange={this.handleLocationChange}
              >
                {stateOptions.map((abbr, index) => {
                  return <option value={abbr.value}>{abbr.value}</option>;
                })}
              </select>
              <h3 className="resetFilters" onClick={this.resetFilters}>
                Reset Filters
              </h3>
              <label>Select a Genre</label>
              <select
                value={this.state.genre || ""}
                name={this.state.genre}
                id={this.state.genre}
                onChange={this.handleGenreChange}
              >
                {filterOptions
                  .sort(function (a, b) {
                    if (a.label < b.label) {
                      return -1;
                    }
                    if (a.label > b.label) {
                      return 1;
                    }
                    return 0;
                  })
                  .map((genre, index) => {
                    return (
                      <option key={index} value={genre.value}>
                        {genre.value}
                      </option>
                    );
                  })}
              </select>
            </div>
          </div>
          <div className="restaurant-filter">
            <table id="myTable" className="restaurants">
              <tbody>
                <tr>{this.createHeader()}</tr>
                {this.state.location != null && this.state.genre != null
                  ? this.tableData(bothFiltersActive)
                  : this.state.genre != null && this.state.searchTerm != ""
                  ? this.tableData(searchAndGenreActive)
                  : this.state.searchTerm === "" &&
                    this.state.location === null &&
                    this.state.genre === null
                  ? this.tableData(currentItems)
                  : this.state.location != null
                  ? this.tableData(locationArray)
                  : this.state.genre != null
                  ? this.tableData(genreArray)
                  : this.state.location != null &&
                    this.state.genre != null &&
                    this.state.searchTerm === ""
                  ? this.tableData(
                      searched.concat(genreFiltered, locationFiltered)
                    )
                  : this.tableData(searched)}
              </tbody>
            </table>
          </div>
          <Pagination
            totalRecords={totalItems}
            pageLimit={10}
            pageNeighbours={1}
            onPageChanged={this.onChangePage}
          />
          {currentPage && (
            <span className="currentPage">
              Page <span className="font-weight-bold">{currentPage}</span> /{" "}
              <span className="font-weight-bold">{totalPages}</span>
            </span>
          )}
        </div>
      </div>
    );
  }
}

export default Table;
