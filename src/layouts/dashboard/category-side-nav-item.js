import {
  Box,
  ButtonBase,
  Collapse,
  List,
  ListItem,
  SvgIcon,
} from '@mui/material';
import ChevronDownIcon from '@heroicons/react/24/solid/ChevronDownIcon';
import ChevronUpIcon from '@heroicons/react/24/solid/ChevronUpIcon';
import { useState } from 'react';
import PropTypes from 'prop-types';
import { SideNavItem } from './side-nav-item';
import { usePathname } from 'next/navigation';

export const CategorySideNavItem = props => {
  const { title, icon, items } = props;

  const pathname = usePathname();
  const [expanded, setExpanded] = useState(false);

  const handleToggle = () => {
    setExpanded(prevExpanded => !prevExpanded);
  };

  return (
    <li>
      <ButtonBase
        onClick={handleToggle}
        sx={{
          alignItems: 'center',
          borderRadius: 1,
          display: 'flex',
          justifyContent: 'flex-start',
          pl: '16px',
          pr: '16px',
          py: '6px',
          textAlign: 'left',
          width: '100%',
          ...(expanded && {
            backgroundColor: 'rgba(255, 255, 255, 0.04)',
          }),
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.04)',
          },
        }}
      >
        {icon && (
          <Box
            component="span"
            sx={{
              alignItems: 'center',
              color: 'neutral.400',
              display: 'inline-flex',
              justifyContent: 'center',
              mr: 2,
            }}
          >
            {icon}
          </Box>
        )}
        <Box
          component="span"
          sx={{
            color: 'neutral.400',
            flexGrow: 1,
            fontFamily: theme => theme.typography.fontFamily,
            fontSize: 14,
            fontWeight: 600,
            lineHeight: '24px',
            whiteSpace: 'nowrap',
          }}
        >
          {title}
        </Box>
      </ButtonBase>

      <List component="ul" disablePadding sx={{ py: '8px' }}>
        {items.map(item => {
          const active = item.path ? pathname === item.path : false;

          return (
            <ListItem
              key={item.title}
              disablePadding
              sx={{ pl: '16px', width: '100%' }}
            >
              <SideNavItem
                active={active}
                disabled={item.disabled}
                external={item.external}
                icon={item.icon}
                path={item.path}
                title={item.title}
              />
            </ListItem>
          );
        })}
      </List>
    </li>
  );
};

CategorySideNavItem.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.node.isRequired,
  items: PropTypes.array.isRequired,
};
