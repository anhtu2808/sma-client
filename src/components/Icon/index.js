import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { resolveIcon } from '../../utils/icons';

/**
 * Icon component - dual-mode wrapper for Font Awesome icons.
 *
 * Static usage:  <Icon icon={faUser} className="text-primary" />
 * Dynamic usage: <Icon name="person" className="text-primary" />
 */
const Icon = ({ icon, name, className, ...props }) => {
  const resolved = icon || resolveIcon(name);
  return <FontAwesomeIcon icon={resolved} className={className} {...props} />;
};

export default Icon;
