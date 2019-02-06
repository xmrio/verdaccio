/**
 * @prettier
 * @flow
 */

import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import { DetailContextConsumer } from '../../pages/version/index';
import Readme from '../Readme';
import Versions from '../Versions';
import { preventXSS } from '../../utils/sec-utils';
import Tabs from '@material-ui/core/Tabs/index';
import Tab from '@material-ui/core/Tab/index';
import { Content } from './styles';
import Dependencies from '../Dependencies';
import UpLinks from '../UpLinks';
import { getRouterPackageName } from '../../utils/package';

const getTabPositionByPage = page => {
  switch (page) {
    case 'uplink': {
      return {
        tabPosition: 3,
      };
    }
    case 'versions': {
      return {
        tabPosition: 2,
      };
    }
    case 'dependencies': {
      return {
        tabPosition: 1,
      };
    }
    case 'readme': {
      return {
        tabPosition: 0,
      };
    }
    default:
      return {
        tabPosition: 0,
      };
  }
};

const getPageByPosition = tabPosition => {
  const pages = ['readme', 'dependencies', 'versions', 'uplinks'];
  if (tabPosition <= pages.length) {
    return pages[tabPosition];
  }

  return 'readme';
};

class DetailContainer extends Component<any, any> {
  state = {
    tabPosition: 0,
  };

  static getDerivedStateFromProps(nextProps: any) {
    const { match } = nextProps;
    if (match.params.action) {
      const action = match.params.action;

      return getTabPositionByPage(action);
    }
  }

  render() {
    return (
      <DetailContextConsumer>
        {context => {
          // $FlowFixMe
          return this.renderTabs(context);
        }}
      </DetailContextConsumer>
    );
  }

  // $FlowFixMe
  renderTabs = ({ readMe }) => {
    const { tabPosition } = this.state;

    return (
      <React.Fragment>
        <Tabs indicatorColor={'primary'} onChange={this.handleChange} textColor={'primary'} value={tabPosition} variant={'fullWidth'}>
          <Tab label={'Readme'} />
          <Tab label={'Dependencies'} />
          <Tab label={'Versions'} />
          <Tab label={'Uplinks'} />
        </Tabs>
        <Content>
          {tabPosition === 0 && this.renderReadme(readMe)}
          {tabPosition === 1 && <Dependencies />}
          {tabPosition === 2 && <Versions />}
          {tabPosition === 3 && <UpLinks />}
        </Content>
      </React.Fragment>
    );
  };

  renderReadme = (readMe: string) => {
    const encodedReadme = preventXSS(readMe);

    return <Readme description={encodedReadme} />;
  };

  handleChange = (event: any, tabPosition: number) => {
    const { match, history } = this.props;
    event.preventDefault();
    this.setState({ tabPosition }, () => {
      const packageName = getRouterPackageName(match);

      history.push(`/-/web/detail/${packageName}/${getPageByPosition(tabPosition)}`);
    });
  };
}

export default withRouter(DetailContainer);
