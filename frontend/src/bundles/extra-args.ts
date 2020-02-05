import Api from '../api/Api';

export default {
	name: 'extra-args',
	getExtraArgs: () => ({
		fetchApi: new Api(process.env.API_URL || 'http://localhost:8082')
	})
};
