import type { webpack } from 'wabix/dist/compiled/webpack/webpack'

const EmptyLoader: webpack.LoaderDefinitionFunction = () => 'export default {}'
export default EmptyLoader
