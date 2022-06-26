import _ from 'lodash'
import './style.css';
import Icon from './icon.png';
import Data from './data.xml';
import Notes from './data.csv';
import toml from './data.toml';
import yaml from './data.yaml';
import json from './data.json5';

console.log('from TOML:', toml.title); // output `TOML Example`
console.log('from TOML:', toml.owner.name); // output `Tom Preston-Werner`

console.log('from YAML: ', yaml.title); // output `YAML Example`
console.log('from YAML: ', yaml.owner.name); // output `Tom Preston-Werner`

console.log('from JSON5: ', json.title); // output `JSON5 Example`
console.log('from JSON5: ', json.owner.name); // output `Tom Preston-Werner`

function component() {
    const element = document.createElement('div');

    // Lodash, now imported by this script
    element.innerHTML = _.join(['Hello', 'webpack'], ' ');
    element.classList.add('hello');

    // Add the image to our existing div.
    const myIcon = new Image();
    myIcon.src = Icon;

    element.appendChild(myIcon);

    console.log('from XML: ', Data);
    console.log('from CSV: ', Notes);

    return element;
}

document.body.appendChild(component());