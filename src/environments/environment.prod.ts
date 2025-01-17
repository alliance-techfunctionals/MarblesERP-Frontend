import packageInfo from '../../package.json';

export const environment = {
  appVersion: packageInfo.version,
  production: true,
  apiUrl: 'https://server.atf-labs.com:5008/api/',

  // HTTP request timeout value in Milliseconds [2mins -> 2 x 60 x 1000 ]
	requestTimeout: 120000,

	// Maximum records in table pagination
	recordsPerPage: 10,
  tableRecordSize: [10, 15, 20, 25],

  // API Key for Open Source Country and state list
  apiKey: 'HOSJWd3DDgGOJ9mTY01ORc2CxEt7kvKdLCBjyGO1c8nY7nAmokhFW-fnYGHjENz2uck',
  requestUrl: 'https://www.universal-tutorial.com/api/getaccesstoken',
  userEmail: 'suryanshchaudhary908@gmail.com'
};
