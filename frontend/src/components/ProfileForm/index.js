import { connect } from 'react-redux';
import Container from './container';
import { actionCreators as userActions } from 'redux/modules/user';

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		putProfile: (username, changeUsername, name, website, bio, profileImage) => {
			dispatch(userActions.putProfile(username, changeUsername, name, website, bio, profileImage))
		}
	}
}

export default connect(null, mapDispatchToProps)(Container);