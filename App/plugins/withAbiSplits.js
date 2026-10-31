const { withAppBuildGradle } = require('expo/config-plugins');

const ABIS = ['arm64-v8a', 'armeabi-v7a'];

const BLOCK = [
  '    // Un APK par architecture, genere par plugins/withAbiSplits.js.',
  '    // Sans ca, Gradle emballe un APK unique avec les .so des deux ABIs.',
  '    splits {',
  '        abi {',
  '            enable true',
  '            reset()',
  `            include '${ABIS.join("', '")}'`,
  '            universalApk false',
  '        }',
  '    }',
].join('\n');

module.exports = function withAbiSplits(config) {
  return withAppBuildGradle(config, (cfg) => {
    if (cfg.modResults.language !== 'groovy') {
      throw new Error('withAbiSplits: android/app/build.gradle doit rester en Groovy');
    }

    const lines = cfg.modResults.contents.split('\n');
    if (lines.some((line) => line.includes('universalApk'))) {
      return cfg;
    }

    const anchor = lines.findIndex((line) => line.trim() === 'android {');
    if (anchor === -1) {
      throw new Error('withAbiSplits: bloc "android {" introuvable dans app/build.gradle');
    }

    lines.splice(anchor + 1, 0, BLOCK);
    cfg.modResults.contents = lines.join('\n');
    return cfg;
  });
};
