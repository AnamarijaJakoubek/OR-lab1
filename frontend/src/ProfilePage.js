import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0, withAuthenticationRequired} from '@auth0/auth0-react';

const ProfilePage = ({ history }) => {
    const { user, isAuthenticated } = useAuth0();
    const navigate = useNavigate();
 

        return (
         <div className="flex justify-center items-center h-screen">
            <div className="bg-blue-100 p-10 rounded-md text-lg">
              <div><strong>Ime:</strong> {user.name}</div>
              <div><strong>Nadimak:</strong> {user.nickname}</div>
              <div><strong>Email:</strong> {user.email}</div>
              <div><strong>ID:</strong> {user.sub}</div>
              <div><strong>Updated:</strong> {user.updated_at}</div>
              <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600" onClick={() => navigate('/')}>
                   Povratak na početnu
                </button>
            </div>
          </div>
        );  
}

export default withAuthenticationRequired(ProfilePage, {
    onRedirecting: () => <div>Da biste prisupili ovoj stranici, morate biti prijavljeni!!</div>,
});