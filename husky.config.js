module.exports = {
  hooks: {
    'pre-commit': 'yarn type-check',
    'pre-push': 'yarn test'
  }
}
