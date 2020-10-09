import React from 'react';
import css from './KonamiKey.module.css';
import {Sequencer} from '@anovel/tachyon';

// Up Up Down Down Left Right Left Right b a
const KonamiSequence = [
	'ArrowUp', 'ArrowUp',
	'ArrowDown', 'ArrowDown',
	'ArrowLeft', 'ArrowRight',
	'ArrowLeft', 'ArrowRight',
	'b', 'a'
];

class KonamiKey extends React.Component {
	state = {pressing: false, validated: false, count: 0};

	/**
	 *
	 * @type {Sequencer}
	 */
	sequencer = new Sequencer(this.props.speed);

	ref = React.createRef();

	timer = () => {};

	comboTimer = () => {};

	validate = () => {
		clearTimeout(this.timer);
		clearTimeout(this.comboTimer);
		this.setState(({count}) => ({validated: true, count: count + 1}), () => {
			this.timer = setTimeout(() => this.setState({validated: false}), 50);
		});

		this.props.getPercentage(this.sequencer.getValidationStatus(KonamiSequence));
		this.comboTimer = setTimeout(() => this.props.getPercentage(0), this.props.speed || 400);
	};

	press = () => {
		clearTimeout(this.timer);
		clearTimeout(this.comboTimer);
		this.setState({pressing: true}, () => {
			this.timer = setTimeout(() => this.setState({pressing: false}), 50);
		});

		this.props.getPercentage(this.sequencer.getValidationStatus(KonamiSequence));
		this.comboTimer = setTimeout(() => this.props.getPercentage(0), this.props.speed || 400);
	};

	componentDidMount() {
		this.sequencer.listen(this.ref.current);
		this.sequencer.register(KonamiSequence, this.validate, this.press);
	}

	render() {
		const {title, speed, getPercentage, ...props} = this.props;

		return (
			<div ref={this.ref} className={css.wrapper} tabIndex={0} {...props}>
				<div className={css.title}>{title}</div>
				<div className={css.subTitle}>{speed || 400} ms</div>
				<div className={css.feedback}>
					<div className={`${css.button} ${this.state.pressing ? css.pressed : ''} ${this.state.validated ? css.validated : ''}`}/>
				</div>
				<div className={css.score}>Score: {this.state.count}</div>
			</div>
		);
	}
}

export default KonamiKey;