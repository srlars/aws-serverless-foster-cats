import PropTypes from "prop-types";
import React, { ChangeEvent, useState } from "react";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "reactstrap";
import log from "../utils/Log";
import { Cat } from "../types/Cat";
import { putPhoto } from "../api/cat-pool-api";
import uuid from "uuid";

export interface Props {
  jwt: string | undefined;
  fosteredCats: Cat[];
  setFosteredCats: (arg: Cat[]) => void;
  modal: boolean;
  setModal: (arg: boolean) => void;
  signedUrl: string;
  currentCatId: string;
  getCatsForUser: (jwt: string) => void;
}

const UploadCatImage: React.FC<Props> = ({
  jwt,
  fosteredCats,
  setFosteredCats,
  modal,
  setModal,
  signedUrl,
  currentCatId,
  getCatsForUser,
}) => {
  const [picture, setPicture] = useState<File | undefined>(undefined);

  const toggle = (): void => setModal(!modal);

  /**
   * User has selected a picture to upload
   * @param e
   */
  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>): void => {
    if (event.target.files && event.target.files.length) {
      const file = event.target.files[0];
      log.debug(`JJJ ${JSON.stringify(file.name)}`);
      setPicture(file);
    }
  };

  /**
   *
   */
  const uploadPhoto = async (): Promise<void> => {
    if (signedUrl && jwt && picture) {
      log.info(`About to upload ${picture.name}`);
      const response = await putPhoto(signedUrl, picture);
      log.info(response);
      if (response.status < 299) {
        // On successful upload, close modal and refresh
        setModal(false);
        const cats = [...fosteredCats];
        cats.filter((cat) => cat.catId === currentCatId)[0].nonce = uuid.v4();
        setFosteredCats(cats);
        getCatsForUser(jwt);
      }
    }
  };

  return (
    <Modal isOpen={modal} toggle={toggle}>
      <ModalHeader toggle={toggle}>Upload Photo</ModalHeader>
      <ModalBody>
        <p>A great photo helps to successfully foster your cat!</p>
        <p>
          <Input
            type="file"
            onChange={(e): void => handleFileSelect(e)}
            accept="image/png, image/jpeg"
            id="upload-file"
          />
        </p>
      </ModalBody>
      <ModalFooter>
        <Button
          color="secondary"
          onClick={uploadPhoto}
          disabled={!picture?.name}>
          Upload Photo
        </Button>{" "}
        <Button color="secondary" onClick={toggle}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};

UploadCatImage.propTypes = {
  jwt: PropTypes.string.isRequired,
  fosteredCats: PropTypes.arrayOf(
    PropTypes.shape({
      catId: PropTypes.string.isRequired,
      ownerId: PropTypes.string.isRequired,
      race: PropTypes.string.isRequired,
      gender: PropTypes.string.isRequired,
      age: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      createdAt: PropTypes.string.isRequired,
      pictureUrl: PropTypes.string,
      nonce: PropTypes.string,
    }).isRequired
  ).isRequired,
  setFosteredCats: PropTypes.func.isRequired,
  modal: PropTypes.bool.isRequired,
  setModal: PropTypes.func.isRequired,
  signedUrl: PropTypes.string.isRequired,
  currentCatId: PropTypes.string.isRequired,
  getCatsForUser: PropTypes.func.isRequired,
};

export default UploadCatImage;
