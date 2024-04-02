'use client'

import React, { createContext, useReducer, useContext } from 'react';

type RoomState = {
    rooms: Array<string>;
    currentRoom: string;
};

type RoomAction = {
    type: string;
    rooms: [];
    currentRoom: string;
};

type RoomContext = {
    state: RoomState;
    dispatch: React.Dispatch<RoomAction>;
};

export const RoomContext = createContext<RoomContext>({state: {rooms: [], currentRoom: ''}, dispatch: () => {}});

const reducer = (state: RoomState, action: RoomAction) => {
    switch (action.type) {
        case 'SET_ROOMS':
            return {
                ...state,
                rooms: action.rooms,
                currentRoom: state.currentRoom,
            };
        case 'SET_CURRENT_ROOM':
            return {
                ...state,
                rooms: state.rooms,
                currentRoom: action.currentRoom,
            };
        default:
            return state;
    }
}

export function RoomContextProvider ({children}: {children: React.ReactNode}) {
    const [state, dispatch] = useReducer(reducer, { rooms: [], currentRoom: '' });
    
    return (
        <RoomContext.Provider value={{ state, dispatch }}>
        {children}
        </RoomContext.Provider>
    );
}

export function useRoomContext() {
    const context = useContext(RoomContext);
    if (!context) {
        throw new Error('useRoomContext must be used within a RoomContextProvider');
    }
    return context;
}