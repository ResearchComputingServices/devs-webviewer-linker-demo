import React from 'react';
import clsx from 'clsx';
import { Switch } from 'react-router-dom';
import {
    AppBar,
    Toolbar,
    Box,
    Typography,
    Link,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import {
    Brightness2 as LightModeIcon,
    Flare as DarkModeIcon,
} from '@material-ui/icons';
import { useTranslation } from 'react-i18next';
import Logo from '../Logo';
import Confirmation from '../Confirmation';
import {
    useWindowSize,
    useService,
    useActions,
    useStore,
} from '../../hooks';
import { routes } from '../../config';
import UserMenu from './UserMenu';

export const useStyles = makeStyles(theme => ({
    toolbar: {
        paddingLeft: 0,
        paddingRight: 0,
    },
    appBar: {
        marginLeft: theme.spacing(2),
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        // Todo need to use appBar height from theme
        height: 64,
        alignItems: 'center',
    },
    content: {
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        // TODO need to use appBar height from themes.
        paddingTop: 64,
    },
}));

function Main() {
    const classes = useStyles();
    const dimensions = useWindowSize();
    const routesAssemblerService = useService('routesAssembler');
    const theme = useStore('theme');
    const themeActions = useActions('theme');
    const isDark = theme.palette.type === 'dark';
    const [t] = useTranslation('common');
    const [openConfirmation, setOpenConfirmation] = React.useState(false);

    const switchThemeMode = () => themeActions.setMode(!isDark ? 'dark' : 'light');

    return (
        <>
            <title>{t('title')}</title>
            <AppBar position='fixed'>
                <Toolbar className={classes.toolbar}>
                    <Logo />
                    <Box className={classes.appBar}>
                        <Typography
                            className={
                                clsx(
                                    { [classes.hide]: dimensions.width < 690 },
                                )
                            }
                            variant='h5'
                        >
                            <Link
                                color='inherit'
                                href='/'
                                style={{ textDecoration: 'none' }}
                            >
                                {t('appBar.title')}
                            </Link>
                        </Typography>
                        <UserMenu
                            displayName={t('appBar.settings')}
                            dropdowns={[
                                {
                                    title: `${!isDark ? t('appBar.dark') : t('appBar.light')} ${t('appBar.theme')}`,
                                    Icon: !isDark ? <LightModeIcon /> : <DarkModeIcon />,
                                    handler: switchThemeMode,
                                },
                            ]}
                        />
                    </Box>
                </Toolbar>
            </AppBar>
            <main className={classes.content}>
                <Switch>{routesAssemblerService.assemble(routes)}</Switch>
            </main>
            <Confirmation
                content={t('appBar.sessionClearWarning')}
                onClose={() => setOpenConfirmation(false)}
                onConfirm={() => {
                    setOpenConfirmation(false);
                }}
                open={openConfirmation}
            />
        </>
    );
}

export default Main;
