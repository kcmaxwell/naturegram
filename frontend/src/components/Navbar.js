import { useCallback, useContext, useEffect, useState, useRef } from 'react';
import { UserContext } from '../context/UserContext';
import { useNavigate, useParams, Outlet } from 'react-router-dom';
import UserNavbarDropdown from './UserNavbarDropdown';
import Popup from './Popup';
import Upload from './Upload';
import { useDetectOutsideClick } from '../hooks/useDetectOutsideClick';
import '../App.css';

export default function Navbar() {
	const navigate = useNavigate();
	const [userContext, setUserContext] = useContext(UserContext);
	const dropdownRef = useRef(null);
	const [isDropdownActive, setIsDropdownActive] = useDetectOutsideClick(
		dropdownRef,
		false
	);

	const [isUploadVisible, setIsUploadVisibile] = useDetectOutsideClick(
		dropdownRef,
		false
	);

	return userContext.details ? (
		<>
			<nav className="navbar">
				<a href="/" className="logo" data-cy="logo">
					Naturegram
				</a>
				<div>
					<button data-cy="upload" onClick={() => setIsUploadVisibile(!isUploadVisible)}>Upload</button>
					<span>
						<button
							data-cy="dropdown-button"
							onClick={() => setIsDropdownActive(!isDropdownActive)}
						>
							Dropdown
						</button>
                        <nav ref={dropdownRef} className={`dropdown ${isDropdownActive ? 'active' : 'inactive'}`}>
                            <UserNavbarDropdown username={userContext.details.username}/>
                        </nav>
					</span>
				</div>
			</nav>

			{isUploadVisible && (
				<Popup innerRef={dropdownRef}>
					<Upload />
				</Popup>
			)}

			<Outlet />
		</>
	) : (
		<></>
	);
}
