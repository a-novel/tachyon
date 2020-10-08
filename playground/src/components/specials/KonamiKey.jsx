import React from 'react';
import css from './KonamiKey.module.css';
import {keys} from '@anovel/tachyon';

// Up Up Down Down Left Right Left Right b a
const KonamiSequence = [
	'ArrowUp', 'ArrowUp',
	'ArrowDown', 'ArrowDown',
	'ArrowLeft', 'ArrowRight',
	'ArrowLeft', 'ArrowRight',
];

class KonamiKey extends React.Component {
	state = {pressing: false, validated: false, count: 0};

	sequencer = new keys.sequencer(this.props.speed);

	ref = React.createRef();

	timer = () => {};

	validate = () => {
		clearTimeout(this.timer);
		this.setState({validated: true}, () => {
			this.timer = setTimeout(() => this.setState({validated: false}), 50);
		});
	};

	press = () => {
		clearTimeout(this.timer);
		this.setState({pressing: true}, () => {
			this.timer = setTimeout(() => this.setState({pressing: false}), 50);
		});

		this.props.checkCombo(this.sequencer.);
	};

	componentDidMount() {
		this.sequencer.listen(this.ref.current);
		this.sequencer.register(this.validate, KonamiSequence, this.press);
	}

	render() {
		return (
			<div ref={this.ref} className={css.wrapper}>
				<div className={css.title}>{this.props.title}</div>
				<div className={css.subTitle}>{this.props.speed} ms</div>
				<div className={css.feedback}>

				</div>
			</div>
		);
	}
}

export default KonamiKey;