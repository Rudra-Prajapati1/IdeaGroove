import { User2 } from "lucide-react";

const ProfileUpload = ({ file, onChange }) => (
  <div>
    <label
      htmlFor="profilePic"
      className="w-30 h-30 border-2 border-dashed border-primary/60
                 rounded-full flex flex-col items-center justify-center
                 cursor-pointer hover:border-primary hover:bg-primary/5
                 transition-colors text-sm text-primary"
    >
      {!file ? (
        <>
          <User2 className="w-12 h-12" />
          <span className="text-center text-xs">
            Upload <br /> Profile Picture
          </span>
        </>
      ) : (
        <img
          src={URL.createObjectURL(file)}
          alt="Preview"
          className="w-full h-full rounded-full object-cover"
        />
      )}
    </label>

    <input
      type="file"
      id="profilePic"
      accept="image/*"
      onChange={onChange}
      className="hidden"
    />
  </div>
);

export default ProfileUpload;
