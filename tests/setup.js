// This module will be executed before all other tests are executed,
// so import all necessary modules which should be included for webpack compiling.
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

// Sans cette configuration, tout appel à shallow() / mount() lève
// « Enzyme expects an adapter to be configured ».
Enzyme.configure({ adapter: new Adapter() });
