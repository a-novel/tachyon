import React from 'react';
import Description from '../../components/visual/Decription';
import Page from '../../components/containers/Page';
import Title from '../../components/visual/Title';
import Paragraph from '../../components/visual/Paragraph';
import css from './Keys.module.css';
import KonamiKey from '../../components/specials/KonamiKey';
import Svg from '../../components/svg/Svg';
import {ArrowDown, ArrowLeft, ArrowRight, ArrowUp, XboxA, XboxB} from '../../assets/icons';

class Keys extends React.Component {
	state = {selected: -1, percentage: 0};
	
	updatePercentage = percentage => this.setState({percentage});

	render() {
		const {percentage} = this.state;
		
		return (
			<Page>
				<Description>Keys is an advanced event listener to trigger special actions on a combo of keys.</Description>
				<Title>Konami Code Game</Title>
				<Paragraph>
					Press the keys displayed on the bottom line fast enough to validate the combo. Click within one of the 3 difficulty level boxes to start recording.
				</Paragraph>
				<div className={css.gameArea}>
					<div className={css.gameTable}>
						<KonamiKey title='Slow' speed={800} getPercentage={this.updatePercentage}/>
						<KonamiKey title='Default' speed={400} getPercentage={this.updatePercentage}/>
						<KonamiKey title='Fast' speed={200} getPercentage={this.updatePercentage}/>
						<KonamiKey title='Hardcore' speed={100} getPercentage={this.updatePercentage}/>
					</div>
					<div className={css.keyCodeBar}>
						<Svg className={`${css.keyCodeIndication} ${percentage >= 1 ? css.validated : ''}`} component={ArrowUp}/>
						<Svg className={`${css.keyCodeIndication} ${percentage >= 2 ? css.validated : ''}`} component={ArrowUp}/>
						<Svg className={`${css.keyCodeIndication} ${percentage >= 3 ? css.validated : ''}`} component={ArrowDown}/>
						<Svg className={`${css.keyCodeIndication} ${percentage >= 4 ? css.validated : ''}`} component={ArrowDown}/>
						<Svg className={`${css.keyCodeIndication} ${percentage >= 5 ? css.validated : ''}`} component={ArrowLeft}/>
						<Svg className={`${css.keyCodeIndication} ${percentage >= 6 ? css.validated : ''}`} component={ArrowRight}/>
						<Svg className={`${css.keyCodeIndication} ${percentage >= 7 ? css.validated : ''}`} component={ArrowLeft}/>
						<Svg className={`${css.keyCodeIndication} ${percentage >= 8 ? css.validated : ''}`} component={ArrowRight}/>
						<Svg className={`${css.keyCodeIndication} ${percentage >= 9 ? css.validated : ''}`} component={XboxB}/>
						<Svg className={`${css.keyCodeIndication} ${percentage >= 10 ? css.validated : ''}`} component={XboxA}/>
					</div>
				</div>
			</Page>
		);
	}
}

export default Keys;