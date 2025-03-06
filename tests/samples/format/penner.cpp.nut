::ease.none <- function ( t, b, c, d )
{
    return b + ( t == d ? c : 0 );
};
::ease.linear <- function ( t, b, c, d )
{
    return ( c * t ) / d + b;
};

::ease.in_quad <- function ( t, b, c, d )
{
    return c * ( t /= d ) * t + b;
};
::ease.in_cubic <- function ( t, b, c, d )
{
    return c * ( t /= d ) * t * t + b;
};
::ease.in_quart <- function ( t, b, c, d )
{
    return c * ( t /= d ) * t * t * t + b;
};
::ease.in_quint <- function ( t, b, c, d )
{
    return c * ( t /= d ) * t * t * t * t + b;
};
::ease.in_sine <- function ( t, b, c, d )
{
    return -c * cos( ( t / d ) * ( PI / 2 ) ) + c + b;
};
::ease.in_expo <- function ( t, b, c, d )
{
    return t == 0 ? b : c * pow( 2, 10 * ( t / d - 1 ) ) + b;
};
::ease.in_circ <- function ( t, b, c, d )
{
    return -c * ( sqrt( 1 - ( t /= d ) * t ) - 1 ) + b;
};
::ease.in_elastic <- function ( t, b, c, d, a = null, p = null )
{
    local s;
    if ( t == 0 ) return b;
    if ( ( t /= d ) == 1 ) return b + c;
    if ( p == null ) p = d * 0.3;
    if ( a == null || a < fabs( c ) )
    {
        a = c;
        s = p / 4;
    }
    else s = ( p / ( 2 * PI ) ) * asin( c / a );
    return (
        -(
            a *
            pow( 2, 10 * ( t -= 1 ) ) *
            sin( ( ( t * d - s ) * ( 2 * PI ) ) / p )
         ) + b
    );
};
::ease.in_back <- function ( t, b, c, d, s = 1.70158 )
{
    return c * ( t /= d ) * t * ( ( s + 1 ) * t - s ) + b;
};
::ease.in_bounce <- function ( t, b, c, d )
{
    return c - ::ease.out_bounce( d - t, 0, c, d ) + b;
};

::ease.out_quad <- function ( t, b, c, d )
{
    return -c * ( t /= d ) * ( t - 2 ) + b;
};
::ease.out_cubic <- function ( t, b, c, d )
{
    return c * ( ( t = t / d - 1 ) * t * t + 1 ) + b;
};
::ease.out_quart <- function ( t, b, c, d )
{
    return -c * ( ( t = t / d - 1 ) * t * t * t - 1 ) + b;
};
::ease.out_quint <- function ( t, b, c, d )
{
    return c * ( ( t = t / d - 1 ) * t * t * t * t + 1 ) + b;
};
::ease.out_sine <- function ( t, b, c, d )
{
    return c * sin( ( t / d ) * ( PI / 2 ) ) + b;
};
::ease.out_expo <- function ( t, b, c, d )
{
    return t == d ? b + c : c * ( -pow( 2, ( -10 * t ) / d ) + 1 ) + b;
};
::ease.out_circ <- function ( t, b, c, d )
{
    return c * sqrt( 1 - ( t = t / d - 1 ) * t ) + b;
};
::ease.out_elastic <- function ( t, b, c, d, a = null, p = null )
{
    local s;
    if ( t == 0 ) return b;
    if ( ( t /= d ) == 1 ) return b + c;
    if ( p == null ) p = d * 0.3;
    if ( a == null || a < fabs( c ) )
    {
        a = c;
        s = p / 4;
    }
    else s = ( p / ( 2 * PI ) ) * asin( c / a );
    return (
        a * pow( 2, -10 * t ) * sin( ( ( t * d - s ) * ( 2 * PI ) ) / p ) +
        c +
        b
    );
};
::ease.out_back <- function ( t, b, c, d, s = 1.70158 )
{
    return c * ( ( t = t / d - 1 ) * t * ( ( s + 1 ) * t + s ) + 1 ) + b;
};
::ease.out_bounce <- function ( t, b, c, d )
{
    if ( ( t /= d ) < 1 / 2.75 )
    {
        return c * ( 7.5625 * t * t ) + b;
    }
    else if ( t < 2 / 2.75 )
    {
        return c * ( 7.5625 * ( t -= 1.5 / 2.75 ) * t + 0.75 ) + b;
    }
    else if ( t < 2.5 / 2.75 )
    {
        return c * ( 7.5625 * ( t -= 2.25 / 2.75 ) * t + 0.9375 ) + b;
    }
    else
    {
        return c * ( 7.5625 * ( t -= 2.625 / 2.75 ) * t + 0.984375 ) + b;
    }
};

::ease.in_out_quad <- function ( t, b, c, d )
{
    if ( ( t /= d / 2 ) < 1 ) return ( c / 2 ) * t * t + b;
    return ( -c / 2 ) * ( --t * ( t - 2 ) - 1 ) + b;
};
::ease.in_out_cubic <- function ( t, b, c, d )
{
    if ( ( t /= d / 2 ) < 1 ) return ( c / 2 ) * t * t * t + b;
    return ( c / 2 ) * ( ( t -= 2 ) * t * t + 2 ) + b;
};
::ease.in_out_quart <- function ( t, b, c, d )
{
    if ( ( t /= d / 2 ) < 1 ) return ( c / 2 ) * t * t * t * t + b;
    return ( -c / 2 ) * ( ( t -= 2 ) * t * t * t - 2 ) + b;
};
::ease.in_out_quint <- function ( t, b, c, d )
{
    if ( ( t /= d / 2 ) < 1 ) return ( c / 2 ) * t * t * t * t * t + b;
    return ( c / 2 ) * ( ( t -= 2 ) * t * t * t * t + 2 ) + b;
};
::ease.in_out_sine <- function ( t, b, c, d )
{
    return ( -c / 2 ) * ( cos( ( PI * t ) / d ) - 1 ) + b;
};
::ease.in_out_expo <- function ( t, b, c, d )
{
    if ( t == 0 ) return b;
    if ( t == d ) return b + c;
    if ( ( t /= d / 2 ) < 1 ) return ( c / 2 ) * pow( 2, 10 * ( t - 1 ) ) + b;
    return ( c / 2 ) * ( -pow( 2, -10 * --t ) + 2 ) + b;
};
::ease.in_out_circ <- function ( t, b, c, d )
{
    if ( ( t /= d / 2 ) < 1 ) return ( -c / 2 ) * ( sqrt( 1 - t * t ) - 1 ) + b;
    return ( c / 2 ) * ( sqrt( 1 - ( t -= 2 ) * t ) + 1 ) + b;
};
::ease.in_out_elastic <- function ( t, b, c, d, a = null, p = null )
{
    local s;
    if ( t == 0 ) return b;
    if ( ( t /= d / 2 ) == 2 ) return b + c;
    if ( p == null ) p = d * ( 0.3 * 1.5 );
    if ( a == null || a < fabs( c ) )
    {
        a = c;
        s = p / 4;
    }
    else s = ( p / ( 2 * PI ) ) * asin( c / a );
    if ( t < 1 )
        return (
            -0.5 *
                ( a *
                    pow( 2, 10 * ( t -= 1 ) ) *
                    sin( ( ( t * d - s ) * ( 2 * PI ) ) / p ) ) +
            b
        );
    return (
        a *
            pow( 2, -10 * ( t -= 1 ) ) *
            sin( ( ( t * d - s ) * ( 2 * PI ) ) / p ) *
            0.5 +
        c +
        b
    );
};
::ease.in_out_back <- function ( t, b, c, d, s = 1.70158 )
{
    if ( ( t /= d / 2 ) < 1 )
        return ( c / 2 ) * ( t * t * ( ( ( s *= 1.525 ) + 1 ) * t - s ) ) + b;
    return (
        ( c / 2 ) *
            ( ( t -= 2 ) * t * ( ( ( s *= 1.525 ) + 1 ) * t + s ) + 2 ) +
        b
    );
};
::ease.in_out_bounce <- function ( t, b, c, d )
{
    if ( t < d / 2 ) return ::ease.in_bounce( t * 2, 0, c, d ) * 0.5 + b;
    return ::ease.out_bounce( t * 2 - d, 0, c, d ) * 0.5 + c * 0.5 + b;
};

::ease.out_in_quad <- function ( t, b, c, d )
{
    if ( t < d / 2 ) return ::ease.out_quad( t * 2, 0, c, d ) * 0.5 + b;
    return ::ease.in_quad( t * 2 - d, 0, c, d ) * 0.5 + c * 0.5 + b;
};
::ease.out_in_cubic <- function ( t, b, c, d )
{
    if ( t < d / 2 ) return ::ease.out_cubic( t * 2, 0, c, d ) * 0.5 + b;
    return ::ease.in_cubic( t * 2 - d, 0, c, d ) * 0.5 + c * 0.5 + b;
};
::ease.out_in_quart <- function ( t, b, c, d )
{
    if ( t < d / 2 ) return ::ease.out_quart( t * 2, 0, c, d ) * 0.5 + b;
    return ::ease.in_quart( t * 2 - d, 0, c, d ) * 0.5 + c * 0.5 + b;
};
::ease.out_in_quint <- function ( t, b, c, d )
{
    if ( t < d / 2 ) return ::ease.out_quint( t * 2, 0, c, d ) * 0.5 + b;
    return ::ease.in_quint( t * 2 - d, 0, c, d ) * 0.5 + c * 0.5 + b;
};
::ease.out_in_sine <- function ( t, b, c, d )
{
    if ( t < d / 2 ) return ::ease.out_sine( t * 2, 0, c, d ) * 0.5 + b;
    return ::ease.in_sine( t * 2 - d, 0, c, d ) * 0.5 + c * 0.5 + b;
};
::ease.out_in_expo <- function ( t, b, c, d )
{
    if ( t < d / 2 ) return ::ease.out_expo( t * 2, 0, c, d ) * 0.5 + b;
    return ::ease.in_expo( t * 2 - d, 0, c, d ) * 0.5 + c * 0.5 + b;
};
::ease.out_in_circ <- function ( t, b, c, d )
{
    if ( t < d / 2 ) return ::ease.out_circ( t * 2, 0, c, d ) * 0.5 + b;
    return ::ease.in_circ( t * 2 - d, 0, c, d ) * 0.5 + c * 0.5 + b;
};
::ease.out_in_elastic <- function ( t, b, c, d )
{
    if ( t < d / 2 ) return ::ease.out_elastic( t * 2, 0, c, d ) * 0.5 + b;
    return ::ease.in_elastic( t * 2 - d, 0, c, d ) * 0.5 + c * 0.5 + b;
};
::ease.out_in_back <- function ( t, b, c, d )
{
    if ( t < d / 2 ) return ::ease.out_back( t * 2, 0, c, d ) * 0.5 + b;
    return ::ease.in_back( t * 2 - d, 0, c, d ) * 0.5 + c * 0.5 + b;
};
::ease.out_in_bounce <- function ( t, b, c, d )
{
    if ( t < d / 2 ) return ::ease.out_bounce( t * 2, 0, c, d ) * 0.5 + b;
    return ::ease.in_bounce( t * 2 - d, 0, c, d ) * 0.5 + c * 0.5 + b;
};
