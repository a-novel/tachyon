import React from 'react';
import Description from '../../components/visual/Decription';
import Page from '../../components/containers/Page';
import Title from '../../components/visual/Title';
import Paragraph from '../../components/visual/Paragraph';
import css from './Keys.module.css';

const Keys = () => (
	<Page>
		<Description>Keys is an advanced event listener to trigger special actions on a combo of keys.</Description>
		<Title>Konami Code Game</Title>
		<Paragraph>
			Press the keys displayed on the bottom line fast enough to validate the combo. Click within one of the 3 difficulty level boxes to start recording.
		</Paragraph>
		<div className={css.gameArea}>

		</div>
	</Page>
);

export default Keys;