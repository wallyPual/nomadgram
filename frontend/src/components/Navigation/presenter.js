import React from "react";
import Ionicon from "react-ionicons";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import styles from "./styles.scss";
import Notification from 'components/Notification';

const Navigation = (props, context) => (
	<div className={styles.navigation}>
		<div className={styles.inner}>
		<div className={styles.column}>
			<Link to="/">
				<img
				src={require("images/logo.png")}
				className={styles.logo}
				alt={context.t("Logo")}
				/>
			</Link>
		</div>
		<div className={styles.column}>
			<form onSubmit={props.onSubmit}>
				<input
					type="text"
					placeholder={context.t("Search")}
					className={styles.searchInput}
					onChange={props.onInputChange}
					value={props.value}
				/>
			</form>
		</div>
		<div className={styles.column}>
			<div className={styles.navIcon}>
				<Link to="/explore/">
				<Ionicon icon="ios-compass-outline" fontSize="28px" color="black" />
				</Link>
			</div>
			<div className={styles.navIcon} onClick={props.openNotification}>
				<Ionicon icon="ios-heart-outline" fontSize="28px" color="black" />
			</div>
			<div className={styles.navIcon}>
				<Link to={`/users/${props.username}/`}>
				<Ionicon icon="ios-person-outline" fontSize="32px" color="black" />
				</Link>
			</div>
			<div>
				{props.seeingNotification && <Notification {...props} />}
			</div>
		</div>
		</div>
	</div>
);

Navigation.contextTypes = {
	t: PropTypes.func.isRequired
};

Navigation.propTypes = {
	onSubmit: PropTypes.func.isRequired,
	onInputChange: PropTypes.func.isRequired,
	openNotification: PropTypes.func.isRequired,
	closeNotification: PropTypes.func.isRequired,
	value: PropTypes.string.isRequired,
	username: PropTypes.string.isRequired
}

export default Navigation;
