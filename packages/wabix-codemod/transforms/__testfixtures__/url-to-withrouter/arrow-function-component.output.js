import { withRouter } from "wabix/router";

export default withRouter(withAppContainer(withAuth(props => {
  const test = props.router
})));