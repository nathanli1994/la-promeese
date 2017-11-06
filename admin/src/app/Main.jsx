import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Home from './components/Home.jsx';
import StudentDetail from './components/StudentDetail.jsx';
import CMS from './pages/CMS.jsx';

class Main extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return(
      <main className="container">
        <Switch>
            <Route exact path='/admin' render={(props) => <Home {...props} user={this.props.user}/>}/>
            <Route path='/admin/students/page/:id' render={(props) => <Home {...props} user={this.props.user}/>}/>
            <Route path='/admin/student/:id' render={(props) => <StudentDetail {...props} user={this.props.user}/>}/>
            <Route path='/admin/cms' component={CMS}/>
        </Switch>
      </main>
    );
  }
}
export default Main;