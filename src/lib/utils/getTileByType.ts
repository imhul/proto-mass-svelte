// import isometric_pixel_0 from '$assets/sprites/cube/isometric_pixel_0054.png';
// import isometric_pixel_1 from '$assets/sprites/cube/isometric_pixel_0207.png';
// import isometric_pixel_2 from '$assets/sprites/cube/isometric_pixel_0208.png';
// import isometric_pixel_3 from '$assets/sprites/cube/isometric_pixel_0209.png';
// import isometric_pixel_4 from '$assets/sprites/cube/isometric_pixel_0210.png';
// import isometric_pixel_5 from '$assets/sprites/cube/isometric_pixel_0211.png';
// import isometric_pixel_6 from '$assets/sprites/cube/isometric_pixel_0212.png';
// import isometric_pixel_7 from '$assets/sprites/cube/isometric_pixel_0063.png';
// import isometric_pixel_8 from '$assets/sprites/cube/isometric_pixel_0063.png';

export const getTileByType = (type: number) => {
    switch (type) {
        case 1:
            return {
                id: type,
                name: 'rock',
                status: 'inactive',
                blocker: false,
                health: 100,
                damage: 0,
                healthPoints: 100
                // src: isometric_pixel_0
            };
        case 2:
            return {
                id: type,
                name: 'titanum',
                status: 'inactive',
                blocker: false,
                health: 130,
                damage: 0,
                healthPoints: 130
                // src: isometric_pixel_2
            };
        case 3:
            return {
                id: type,
                name: 'sand',
                status: 'inactive',
                blocker: false,
                health: 90,
                damage: 0,
                healthPoints: 90
                // src: isometric_pixel_3
            };
        case 4:
            return {
                id: type,
                name: 'grass',
                status: 'inactive',
                blocker: false,
                health: 100,
                damage: 0,
                healthPoints: 100
                // src: isometric_pixel_4
            };
        case 5:
            return {
                id: type,
                name: 'platinum',
                status: 'inactive',
                blocker: false,
                health: 120,
                damage: 0,
                healthPoints: 120
                // src: isometric_pixel_5
            };
        case 6:
            return {
                id: type,
                name: 'resin',
                status: 'inactive',
                blocker: false,
                health: 80,
                damage: 0,
                healthPoints: 80
                // src: isometric_pixel_6
            };
        case 7:
            return {
                id: type,
                name: 'ferrum',
                status: 'inactive',
                blocker: false,
                health: 110,
                damage: 0,
                healthPoints: 110
                // src: isometric_pixel_7
            };
        case 8:
            return {
                id: type,
                name: 'uranium',
                status: 'inactive',
                blocker: false,
                health: 140,
                damage: 0,
                healthPoints: 140
                // src: isometric_pixel_8
            };

        default:
            return {
                id: '',
                name: '', // to show title
                status: '', // inactive, grow, damage, attack, repair
                blocker: false, // for collisions
                health: 0, // real health points now
                damage: 0,
                healthPoints: 0, // total health points
                src: ''
            };
    }
};
