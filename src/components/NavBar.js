import React, {Component} from 'react';
import PropTypes from 'prop-types';
import 'bootstrap';

class NavBar extends Component {

    static propTypes = {
        title: PropTypes.string.isRequired,
        href: PropTypes.string,
        logo: PropTypes.string,
        items: PropTypes.array,
        search: PropTypes.object
    }   
 
    /**
     * Renders a BootStrap NavBar with branding, buttons and a search box.
     * @returns {String}
     */
    render() {
        return (
            <nav className="navbar navbar-expand-md fixed-top navbar-dark bg-dark">
                <a className="navbar-brand" href={this.props.href}>
                    <img src={this.props.logo} width="32" height="32" className="d-inline-block align-top" alt=""/>
                    {this.props.title}
                </a>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#main-menu" aria-controls="main-menu" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="main-menu">
                    <ul className="navbar-nav mr-auto">
                      {this.props.items}
                    </ul>
                    {this.props.search}
                </div>
            </nav>
        );
    }
};

export default NavBar;
