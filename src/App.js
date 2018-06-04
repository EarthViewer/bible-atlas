/* 
 * Copyright (c) 2018 Bruce Schubert.
 * The MIT License
 * http://www.opensource.org/licenses/mit-license
 */
import React, { Component } from 'react'
import Globe from 'worldwind-react-globe'
import {
  CardColumns,
  Container } from 'reactstrap'
import {
  LayersCard,
  MarkersCard,
  NavBar,
  NavBarItem,
  SearchBox,
  SettingsCard,
  Tools } from 'worldwind-react-globe-bs4'

import './App.css'

/* global WorldWind */

const MARKERS_LAYER = 'Markers';

export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      globe: null
    }
    this.oldTest = new Map()
    this.oldTest.set('Genesis', {kml: 'gen.kml'})
    this.oldTest.set('Exodus', {kml: 'exod.kml'})
    this.oldTest.set('Leviticus', {kml: 'lev.kml'})
    this.oldTest.set('Numbers', {kml: 'num.kml'})
    this.oldTest.set('Deuteronomy', {kml: 'duet.kml'})
    this.oldTest.set('Joshua', {kml: 'josh.kml'})
    this.oldTest.set('Judges', {kml: 'judg.kml'})
    this.oldTest.set('Ruth', {kml: 'ruth.kml'})
    this.oldTest.set('1 Samuel', {kml: '1sm.kml'})
    this.oldTest.set('2 Samuel', {kml: '2sam.kml'})
    this.oldTest.set('1 Kings', {kml: '1kgs.kml'})
    this.oldTest.set('2 Kings', {kml: '2kgs.kml'})
    this.oldTest.set('1 Chronicles', {kml: '1chr.kml'})
    this.oldTest.set('2 Chronicles', {kml: ''})
    this.oldTest.set('Ezra', {kml: 'esra.kml'})
    this.oldTest.set('Nehemiah', {kml: 'neh.kml'})
    this.oldTest.set('Esther', {kml: 'esth.kml'})
    this.oldTest.set('Job', {kml: 'job.kml'})
    this.oldTest.set('Psalms', {kml: 'ps.kml'})
    this.oldTest.set('Proverbs', {kml: ''})
    this.oldTest.set('Ecclesiastes', {kml: 'eccl.kml'})
    this.oldTest.set('Song of Solomon', {kml: 'song.kml'})
    this.oldTest.set('Isaiah', {kml: 'isa.kml'})
    this.oldTest.set('Jeremiah', {kml: 'jer.kml'})
    this.oldTest.set('Lamentations', {kml: 'lam.kml'})
    this.oldTest.set('Ezekiel', {kml: 'ezek.kml'})
    this.oldTest.set('Daniel', {kml: 'dan.kml'})
    this.oldTest.set('Hosea', {kml: 'hos.kml'})
    this.oldTest.set('Joel', {kml: 'joel.kml'})
    this.oldTest.set('Amos', {kml: 'amos.kml'})
    this.oldTest.set('Obadiah', {kml: 'obad.kml'})
    this.oldTest.set('Jonah', {kml: 'jonah.kml'})
    this.oldTest.set('Micah', {kml: 'mic.kml'})
    this.oldTest.set('Nahum', {kml: 'nah.kml'})
    this.oldTest.set('Habakkuk', {kml: 'hab.kml'})
    this.oldTest.set('Zephaniah', {kml: 'zeph.kml'})
    this.oldTest.set('Haggai', {kml: 'hag.kml'})
    this.oldTest.set('Zechariah', {kml: 'zech.kml'})
    this.oldTest.set('Malachi', {kml: 'mal.kml'})

    this.newTest = new Map()
    this.newTest.set('Matthew', {kml: 'matt.kml'})
    this.newTest.set('Mark', {kml: 'mark.kml'})
    this.newTest.set('Luke', {kml: 'luke.kml'})
    this.newTest.set('John', {kml: 'john.kml'})
    this.newTest.set('Acts (of the Apostles)', {kml: 'acts.kml'})
    this.newTest.set('Romans', {kml: 'rom.kml'})
    this.newTest.set('1 Corinthians', {kml: '1cor.kml'})
    this.newTest.set('2 Corinthians', {kml: '2cor.kml'})
    this.newTest.set('Galatians', {kml: 'gal.kml'})
    this.newTest.set('Ephesians', {kml: 'eph.kml'})
    this.newTest.set('Philippians', {kml: 'phil.kml'})
    this.newTest.set('Colossians', {kml: 'col.kml'})
    this.newTest.set('1 Thessalonians', {kml: '1thess.kml'})
    this.newTest.set('2 Thessalonians', {kml: ''})
    this.newTest.set('1 Timothy', {kml: '1tim.kml'})
    this.newTest.set('2 Timothy', {kml: '2tim.kml'})
    this.newTest.set('Titus', {kml: 'titus.kml'})
    this.newTest.set('Philemon', {kml: 'phil.kml'})
    this.newTest.set('Hebrews', {kml: 'heb.kml'})
    this.newTest.set('James', {kml: ''})
    this.newTest.set('1 Peter', {kml: '1pet.kml'})
    this.newTest.set('2 Peter', {kml: '2pet.kml'})
    this.newTest.set('1 John', {kml: ''})
    this.newTest.set('2 John', {kml: ''})
    this.newTest.set('3 John', {kml: ''})
    this.newTest.set('Jude', {kml: 'jude.kml'})
    this.newTest.set('Revelation', {kml: 'rev.kml'})

    // Set the location of the WorldWind "images" folder to the root of the public folder
    Globe.setBaseUrl("./")

    // Holds a reference to the Map component after mounting
    this.globeRef = React.createRef()
    this.layersRef = React.createRef()
    this.booksRef = React.createRef()
    this.markersRef = React.createRef()
    this.settingsRef = React.createRef()
  }

  componentDidMount() {
    // Get the component with the WorldWindow after mounting
    const globe = this.globeRef.current;
    const layers = [
      {layer: 'blue-marble', options: {category: 'base', enabled: false}},
      {layer: 'blue-marble-landsat', options: {category: 'base', enabled: false}},
      {layer: 'bing-aerial', options: {category: 'base', enabled: false}},
      {layer: 'bing-aerial-labels', options: {category: 'base', enabled: false}},
      {layer: 'eox-sentinal2', options: {category: 'base', enabled: false}},
      {layer: 'eox-sentinal2-labels', options: {category: 'base', enabled: true}},
      {layer: 'renderables', options: {category: 'data', enabled: true, displayName: MARKERS_LAYER}},
      {layer: 'compass', options: {category: 'setting', enabled: false}},
      {layer: 'coordinates', options: {category: 'setting', enabled: true}},
      {layer: 'view-controls', options: {category: 'setting', enabled: true}},
      {layer: 'stars', options: {category: 'setting', enabled: false}},
      {layer: 'atmosphere-day-night', options: {category: 'setting', enabled: false}}
    ];
    layers.forEach((config)=>globe.addLayer(config.layer, config.options));

    // Callback to add book KML as overlays
    let addBook = (book) => {
      // Create a layer for the book
      let title = book[0];
      let kml = './openbibleinfo/books/' + book[1].kml;
      let layer = globe.addLayer('renderables', {category: 'overlay', enabled: false, displayName: title});
      
      // Add the books to the layer
      let kmlFilePromise = new WorldWind.KmlFile(kml);
      kmlFilePromise.then(function(kmlFile) {
        layer.addRenderable(kmlFile);
      });
    };
    // Add the books the the layer lists
    Array.from(this.newTest).reverse().forEach(addBook);
    Array.from(this.oldTest).reverse().forEach(addBook);

    // Trigger a state change now that the globe is valid
    this.setState({globe: globe});
  }

  /**
   * Renders the globe and the panels that render the globe's contents.
   * The Globe element/component sets the primaryGlobe reference used
   * by the panels.
   */
  render() {

    const globe = this.state.globe

    const navbarItems = [
      <NavBarItem key='lyr' title='Layers' icon='list' collapse={this.layersRef.current}/>,
      <NavBarItem key='bks' title='Books' icon='book' collapse={this.booksRef.current}/>,
      <NavBarItem key='mkr' title='Markers' icon='map-marker' collapse={this.markersRef.current}/>,
      <NavBarItem key='set' title='Settings' icon='cog' collapse={this.settingsRef.current}/>
    ]

    const navbarSearch = <SearchBox globe={globe}/>

    return (
      <div>
        <NavBar 
            logo='./images/mapicons/cross-2.png'
            title='Bible Atlas'
            href='https://github.com/emxsys/bible-atlas'
            items={navbarItems}
            search={navbarSearch} />
        <Container fluid className='p-0'>
          <div className='globe'>
            <Globe 
              ref={this.globeRef}
              latitude={31.78}
              longitude={35.24}
              altitude={1e6} />
          </div>
          <div className='overlayTools noninteractive'>
              <Tools 
                globe={globe} 
                markers={this.markersRef.current}
                markersLayerName={MARKERS_LAYER}/>
          </div>
          <div className='overlayCards noninteractive'>
            <CardColumns>
              <LayersCard
                ref={this.layersRef}
                categories={['base']} 
                globe={globe} />
              <LayersCard
                ref={this.booksRef}
                title='Books'
                icon='book'
                categories={['overlay']} 
                globe={globe} />
              <MarkersCard
                ref={this.markersRef}
                globe={globe}
                markersLayerName='Markers' />
              <SettingsCard
                ref={this.settingsRef}
                categories={['setting']} 
                globe={globe} />
            </CardColumns>
          </div>
        </Container>
      </div>
    )
  }
}
