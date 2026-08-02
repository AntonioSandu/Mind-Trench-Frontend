import { ItemType } from './item-type';

export const ITEM_INFO = {

    [ItemType.STICK]: {

        displayName: 'Stick',

        description: 'Makes you move 2 times in one turn, if a beartrap was placed in that path, it will be destroyed. But a second trap would trap you, so watch where you step',

        icon: 'items/Stick.png',

    },

    [ItemType.WIRE]: {

        displayName: 'Wire',

        description: 'Place in on an enemy edge, it will tell you if the virus passed through that edge on the following turn.',

        icon: 'items/Wire.png'

    },

    [ItemType.UMBRELLA]: {

        displayName: 'Umbrella',

        description: 'Place it on your current position, it will shield that node from enemy strikes for one turn.',

        icon: 'items/Umbrella.png'
    },

    [ItemType.CAMPFIRE]: {

        displayName: 'Campfire',
        
        description: 'Place it on your current position, if you sleep this turn it will be like sleeping two turns, though it will reveal your position.',
        
        icon: 'items/Campfire.png'
    },

    [ItemType.BEARTRAP]: {

        displayName: 'Beartrap',

        description: 'Place it on an enemy node, if the virus steps on that node the beartrap will snap, making it spend all its energies for the turn freeing itself. After that turn the trap will be destroyed',

        icon: 'items/Beartrap.png'

    },

    [ItemType.SHEARS]: {

        displayName: 'Shears',

        description: 'Will reveal items that the virus placed on your map near you, it will destroy one random item if any are found (does not go through tunnels). The virus will know if something was destroyed.',

        icon: 'items/Shears.png'
    },
    
    [ItemType.BIRD]: {

        displayName: 'Bird',

        description: 'Send the bird to gather information on the virus\' position, it will tell you three nodes, one of them is its current position.',

        icon: 'items/Bird.png'
    },

    [ItemType.SILENCER]: {

        displayName: 'Silencer',

        description: 'Equip it to make your next strike silent, not revealing your position to the enemy. Lasts only one turn, if you equip it be sure to strike.',

        icon: 'items/Silencer.png'
    }, 

    [ItemType.REVELATION]: {

        displayName: 'Revelation',

        description: 'Use it to gather information on the virus\' inventory.',

        icon: 'items/Revelation.png'
    },

    [ItemType.NUKE]: {

        displayName: 'Nuke',

        description: '[Requires 3 turns of charging] Once charged, your next strike will hit the node selected and all the others around it (tunnels do not count).',

        icon: 'items/Nuke.png'
    },

    [ItemType.NAPALM]: {

        displayName: 'Napalm',

        description: '[Requires 2 turns of charging] Once charged, your next strike will last on the selected node for a second turn, damaging the virus if it steps on that node.',

        icon: 'items/Napalm.png'
    }, 

    
}