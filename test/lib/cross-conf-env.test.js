import assert from 'assert';
import { FilterKeys, ReplaceArgv } from '../../src/lib/cross-conf-env.js';

/** @test {CrossConfEnv} */
describe( 'CrossConfEnv', () => {
  const ENV_APP_NAME  = 'MyApp';
  const ENV_APP_MODE  = 'test';
  const ENV_APP_LANG  = 'en-us';

  // The number that defines the "npm_package_config_NAME" in "beforeEach"
  const ENV_COUNT = 4;

  beforeEach( () => {
    process.env.npm_package_config_app      = ENV_APP_NAME;
    process.env.npm_package_config_appMode  = ENV_APP_MODE;
    process.env.npm_package_config_app_mode = ENV_APP_MODE;
    process.env.npm_package_config_lang     = ENV_APP_LANG;
    process.env.npm_config_app              = ENV_APP_NAME;
    process.env.npm_config_lang             = ENV_APP_LANG;
  } );

  /** @test {FilterKeys} */
  describe( 'FilterKeys', () => {
    it( 'keys', () => {
      const keys      = FilterKeys();
      let   succeeded = keys.some( ( key ) => key === 'npm_package_config_app' );
      assert( succeeded === true );

      succeeded = keys.some( ( key ) => key === 'npm_package_version' );
      assert( succeeded === true );
    } );
  } );

  /** @test {ReplaceArgv} */
  describe( 'ReplaceArgv', () => {
    it( '"var", "$var", "%var%"', () => {
      const expected1 = [ 'test', ENV_APP_NAME, process.env.npm_package_version ];
      const expected2 = [ 'test', ENV_APP_LANG, process.env.npm_package_name ];

      const keys = FilterKeys();
      let   argv = ReplaceArgv( [ 'test', 'npm_package_config_app', 'npm_package_version' ], keys );
      assert.deepEqual( argv, expected1 );

      argv = ReplaceArgv( [ 'test', 'npm_package_config_lang', 'npm_package_name' ], keys );
      assert.deepEqual( argv, expected2 );

      argv = ReplaceArgv( [ 'test', '$npm_package_config_app', '$npm_package_version' ], keys );
      assert.deepEqual( argv, expected1 );

      argv = ReplaceArgv( [ 'test', '$npm_package_config_lang', '$npm_package_name' ], keys );
      assert.deepEqual( argv, expected2 );

      argv = ReplaceArgv( [ 'test', '%npm_package_config_app%', '%npm_package_version%' ], keys );
      assert.deepEqual( argv, expected1 );

      argv = ReplaceArgv( [ 'test', '%npm_package_config_lang%', '%npm_package_name%' ], keys );
      assert.deepEqual( argv, expected2 );
    } );

    it( '"param=var,other", "param=$var,other", "param=%var%,other"', () => {
      const expected1 = [ 'test', 'param=' + ENV_APP_NAME + ',other', 'param=' + process.env.npm_package_version + ',other' ];
      const expected2 = [ 'test', 'param=' + ENV_APP_LANG + ',other', 'param=' + process.env.npm_package_name + ',other' ];

      const keys = FilterKeys();
      let   argv = ReplaceArgv( [ 'test', 'param=npm_package_config_app,other', 'param=npm_package_version,other' ], keys );
      assert.deepEqual( argv, expected1 );

      argv = ReplaceArgv( [ 'test', 'param=npm_package_config_lang,other', 'param=npm_package_name,other' ], keys );
      assert.deepEqual( argv, expected2 );

      argv = ReplaceArgv( [ 'test', 'param=$npm_package_config_app,other', 'param=$npm_package_version,other' ], keys );
      assert.deepEqual( argv, expected1 );

      argv = ReplaceArgv( [ 'test', 'param=$npm_package_config_lang,other', 'param=$npm_package_name,other' ], keys );
      assert.deepEqual( argv, expected2 );

      argv = ReplaceArgv( [ 'test', 'param=%npm_package_config_app%,other', 'param=%npm_package_version%,other' ], keys );
      assert.deepEqual( argv, expected1 );

      argv = ReplaceArgv( [ 'test', 'param=%npm_package_config_lang%,other', 'param=%npm_package_name%,other' ], keys );
      assert.deepEqual( argv, expected2 );
    } );

    it( 'Overlapping prefix', () => {
      const expected = [ ENV_APP_NAME, ENV_APP_MODE, ENV_APP_MODE ];

      const keys = FilterKeys();
      let   argv = ReplaceArgv( [ 'npm_package_config_app', 'npm_package_config_app_mode', 'npm_package_config_appMode' ], keys );
      assert.deepEqual( argv, expected );

      argv = ReplaceArgv( [ '$npm_package_config_app', '$npm_package_config_app_mode', '$npm_package_config_appMode' ], keys );
      assert.deepEqual( argv, expected );

      argv = ReplaceArgv( [ '%npm_package_config_app%', '%npm_package_config_app_mode%', '%npm_package_config_appMode%' ], keys );
      assert.deepEqual( argv, expected );
    } );

    it( 'Maltiple variables in an one paramter: "var1-var2", "$var1-$var2", "%var1%-%var2%"', () => {
      const expected = ENV_APP_NAME + '-' + process.env.npm_package_version;
      const keys = FilterKeys();
      const argv = ReplaceArgv( [
        'npm_package_config_app-npm_package_version',
        '$npm_package_config_app-$npm_package_version',
        '%npm_package_config_app%-%npm_package_version%' ], keys );
      assert.deepEqual( argv, [ expected, expected, expected ] );
    } );

    it( 'npm_config', () => {
      const expected1 = [ 'test', 'param=' + ENV_APP_NAME + ',other', 'param=' + process.env.npm_package_version + ',other' ];
      const expected2 = [ 'test', 'param=' + ENV_APP_LANG + ',other', 'param=' + process.env.npm_package_name + ',other' ];

      const keys = FilterKeys();
      let   argv = ReplaceArgv( [ 'test', 'param=npm_config_app,other', 'param=npm_package_version,other' ], keys );
      assert.deepEqual( argv, expected1 );

      argv = ReplaceArgv( [ 'test', 'param=npm_config_lang,other', 'param=npm_package_name,other' ], keys );
      assert.deepEqual( argv, expected2 );

      argv = ReplaceArgv( [ 'test', 'param=$npm_config_app,other', 'param=$npm_package_version,other' ], keys );
      assert.deepEqual( argv, expected1 );

      argv = ReplaceArgv( [ 'test', 'param=$npm_config_lang,other', 'param=$npm_package_name,other' ], keys );
      assert.deepEqual( argv, expected2 );

      argv = ReplaceArgv( [ 'test', 'param=%npm_config_app%,other', 'param=%npm_package_version%,other' ], keys );
      assert.deepEqual( argv, expected1 );

      argv = ReplaceArgv( [ 'test', 'param=%npm_config_lang%,other', 'param=%npm_package_name%,other' ], keys );
      assert.deepEqual( argv, expected2 );
    } );
  } );
} );
