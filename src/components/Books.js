/* 
 * Copyright (c) 2018 Bruce Schubert.
 * The MIT License
 * http://www.opensource.org/licenses/mit-license
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Globe from 'worldwind-react-globe';
import FontAwesome from 'react-fontawesome';

class Books extends Component {
    constructor(props) {
        super(props);
    }
    
    static propTypes = {
        globe: PropTypes.instanceOf(Globe)
    }   
  
    render() {
      
        function BookList(props) {
          return Array.from(props.books).map(([key,value]) => 
            <button type="button"key={key} className="list-group-item list-group-item-action p-1">
              {key}
            </button>    
          );
        }

        return (
            <div className="card">
                <div className="card-header">
                    <h5 className="card-title">
                        <FontAwesome name='book'/> Books
                        <button type="button" className="close pull-right" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </h5>
                </div>
                <div className="card-body">
                    <ul className="list-group">
                        <BookList books={this.props.oldTest}/>
                    </ul>
                    <hr/>
                    <ul className="list-group">
                        <BookList books={this.props.newTest}/>
                    </ul>
                </div>                  
            </div>
        );
    }
}

export default Books;