import style from './scss/main.scss';
import Presenter from './js/presenter';
import Model from './js/model';
import Controller from './js/controller';
import EventProcessor from './js/eventProcessor';
import Settings from './js/settings';

console.warn = () => {}

document.addEventListener('DOMContentLoaded', async() => {
	const settings = new Settings(),
		controller = new Controller(),
		presenter = new Presenter(settings),
		model = new Model(settings),
		eventProcessor = new EventProcessor(presenter, controller, container);
	await settings.init();
	await controller.init(presenter, model);
	window.dispatchEvent( new Event( 'resize' ) );
	console.log( PIXI.Loader.shared.resources )
});
