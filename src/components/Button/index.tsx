import clsx from 'clsx';
import './Button.scss';
import { ButtonComponentType } from './ButtonType';

const Button: ButtonComponentType = ({
  children,
  mode = 'primary',
  size = 'md',
  shape = 'pill',
  btnIcon = false,
  iconLeft = null,
  iconRight = null,
  disabled = false,
  className = '',
  tooltip = null,
  tooltipPosition = 'top',
  fullWidth = false,
  glow = false,
  ...props
}) => {
  const modeClass = `btn-${mode}`;
  const sizeClass = `btn-${size}`;
  const shapeClass = shape === 'pill' ? 'btn-pill' : 'btn-rounded';
  const iconClass = btnIcon ? 'btn-icon-only' : '';
  const fontClass = 'font-heading';

  return (
    <div
      className={clsx(
        'btn-root',
        fullWidth && 'w-full',
        className,
        tooltip && 'group'
      )}
      style={{ position: 'relative', display: fullWidth ? 'block' : 'inline-block' }}
    >
      <button
        className={clsx(
          'btn',
          modeClass,
          fontClass,
          sizeClass,
          shapeClass,
          iconClass,
          glow && 'btn-glow',
          fullWidth && 'w-full',
        )}
        disabled={disabled}
        {...props}
      >
        {iconLeft && (
          <span className="btn-icon-left">{iconLeft}</span>
        )}
        <span>{children}</span>
        {iconRight && (
          <span className="btn-icon-right">{iconRight}</span>
        )}
      </button>

      {!!tooltip && (
        <div
          className={clsx(
            "absolute z-50 pointer-events-none transition-opacity duration-200 flex items-center",
            "opacity-0 group-hover:opacity-100",
            tooltipPosition === 'top'
              ? "bottom-[100%] left-1/2 transform -translate-x-1/2 mb-2"
              : "top-[100%] left-1/2 transform -translate-x-1/2 mt-2"
          )}
        >
          {tooltipPosition === 'bottom' && (
            <div className="mx-auto">
              <div className="size-3 bg-white rotate-45 translate-y-1/2 shadow-soft" />
            </div>
          )}

          <div className="px-3 py-2 bg-white rounded-xl font-medium text-neutral-600 text-sm whitespace-nowrap shadow-lg">
            {tooltip}
          </div>

          {tooltipPosition === 'top' && (
            <div className="mx-auto">
              <div className="size-3 bg-white rotate-45 -translate-y-1/2 shadow-soft" />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Button;
