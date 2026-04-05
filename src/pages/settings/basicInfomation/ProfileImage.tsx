import { useEffect, useRef, useState } from 'react';
import styles from './profileImage.module.css';
import { Camera } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import axiosInstance from '../../../utils/axiosInstance';

const ProfileImage = () => {
  const [profilePic, setProfilePic] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { accessToken } = useAuth();
  const authHeader = { Authorization: `bearer ${accessToken}` };

  useEffect(() => {
    if (!accessToken) return;
    axiosInstance.get('/api/settings', { headers: authHeader })
      .then(res => setProfilePic(res.data.user.profilePic ?? ''))
      .catch(() => {});
  }, [accessToken]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError('');
    setUploading(true);
    const formData = new FormData();
    formData.append('profilePic', file);
    
    try {
      const res = await axiosInstance.post('/api/settings/profile-pic', formData, { headers: authHeader });
      setProfilePic(res.data.profilePic);
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  return (
    <div className={styles.outerContainer} onClick={() => !uploading && fileInputRef.current?.click()}>
      <input ref={fileInputRef} type="file" accept="image/jpeg,image/jpg,image/png"
        className={styles.hiddenInput} onChange={handleFileChange} />
      <div className={styles.innerContainer}>
        {profilePic ? <img src={profilePic} alt="Profile" className={styles.profileImg} /> : <Camera size={32} />}
        {uploading && <div className={styles.uploadingOverlay}><div className={styles.spinner} /></div>}
      </div>
      <p className={styles.photoText}>{uploading ? 'Uploading...' : 'Upload Photo'}</p>
      {error && <p className={styles.errorText}>{error}</p>}
    </div>
  );
};

export default ProfileImage;
