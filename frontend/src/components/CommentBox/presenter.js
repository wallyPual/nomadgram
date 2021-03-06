import React from 'react';
import PropTypes from 'prop-types';
import Textarea from 'react-textarea-autosize';
import styles from './styles.scss';

const CommentBox = (props, context) => (
	<form className={styles.commentBox}>
		<Textarea
			className={styles.input}
			placeholder={context.t('Add a comment...')}
			value={props.comment}
			onKeyPress={props.handleKeyPress}
			onChange={props.handleInputChange}
		/>
	</form>
)

CommentBox.contextTypes = {
	t: PropTypes.func.isRequired
}
CommentBox.propTypes = {
	comment: PropTypes.string.isRequired,
	handleInputChange: PropTypes.func.isRequired,
	handleKeyPress: PropTypes.func.isRequired,
	photoId: PropTypes.number.isRequired,
}

export default CommentBox;