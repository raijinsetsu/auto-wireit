const config = {
    '*.{js,ts}': ['prettier --write', 'eslint --fix'],
    'package.json': 'sort-package-json',
    '!(package.json)': 'prettier --write --ignore-unknown',
};

export default config;
