import React, {Component} from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';

class NavItem extends Component {

  static propTypes = {
      title: PropTypes.string.isRequired,
      href: PropTypes.string.isRequired,
      icon: PropTypes.string.isRequired
  }   
 
  /**
   * Renders a BootStrap NavBar with branding, buttons and a search box.
   * @returns {String}
   */
  render() {
    return (
        <li className="nav-item">
            <a className="nav-link" data-toggle="collapse" href={this.props.href} role="button">
                <FontAwesome name={this.props.icon} />
                <span className="d-md-none d-lg-inline pl-1" aria-hidden="true">{this.props.title}</span>
            </a>
        </li>
    );
  }
};

export default NavItem;
