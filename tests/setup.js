// This module will be executed before all other tests are executed,
// so import all necessary modules which should be included for webpack compiling.
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter(), disableLifecycleMethods: true });
