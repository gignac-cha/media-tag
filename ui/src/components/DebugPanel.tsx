import { FunctionComponent } from 'react';
import { styles } from './DebugPanelStyle';

interface DebugPanelProperties {
  data: unknown;
}

export const DebugPanel: FunctionComponent<DebugPanelProperties> = ({ data }) => {
  return <pre className={styles.debug}>{JSON.stringify(data, null, 2)}</pre>;
};
