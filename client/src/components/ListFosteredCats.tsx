import { faPencilAlt, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from "prop-types";
import React, { SyntheticEvent, useEffect, useState, useCallback } from "react";
import { Col, Row, Table } from "reactstrap";
import uuid from "uuid";
import {
  checkIfExists,
  deleteCat,
  getPhotoUploadUrl,
  getUserCats,
} from "../api/cat-pool-api";
import { Cat } from "../types/Cat";
import log from "../utils/Log";
import EditCatDetails from "./EditCatDetails";
import UploadCatImage from "./UploadCatImage";

export interface Props {
  jwt: string | undefined;
  fosteredCats: Cat[];
  setFosteredCats: (arg: Cat[]) => void;
}

/**
 * {user} is the authenticated user's JWT
 */
const ListFosteredCats: React.FC<Props> = ({
  jwt,
  fosteredCats,
  setFosteredCats,
}) => {
  const [editCatModal, setEditCatModal] = useState(false);
  const [photoModal, setPhotoModal] = useState(false);
  const [signedUrl, setSignedUrl] = useState<string | undefined>(undefined);
  const [currentCat, setCurrentCat] = useState<Cat | undefined>(undefined);

  /**
   * List of all cats for user
   * @param jwt
   */
  const getCatsForUser = useCallback(
    async (jwt: string): Promise<void> => {
      log.info("Calling API to get fostered cats for user");
      try {
        const response = await getUserCats(jwt);
        const cats = response.data.map((cat) => ({ ...cat, nonce: uuid.v4() }));
        setFosteredCats(cats);
        log.info(`${JSON.stringify(response)}`);
      } catch (e) {
        log.error(JSON.stringify(e));
      }
    },
    [setFosteredCats]
  );

  /**
   * Login will trigger getting list of cats from DynamoDB
   */
  useEffect(() => {
    if (jwt) {
      getCatsForUser(jwt);
    } else {
      setFosteredCats([]);
    }
  }, [getCatsForUser, jwt, setFosteredCats]);

  /**
   * User has clicked icon to edit the photo
   * Get the Signed URL for updating the S3 Bucket
   * and open the Modal to accept a photo payload
   * @param catId
   */
  const handleEditPhoto = async (
    e: SyntheticEvent,
    cat: Cat
  ): Promise<void> => {
    e.stopPropagation();
    log.info(cat.catId);
    if (jwt) {
      try {
        const response = await getPhotoUploadUrl(jwt, cat.catId);
        log.info(JSON.stringify(response));
        if (response.status < 299) {
          log.info("success");
          setSignedUrl(response.data.uploadUrl);
          setCurrentCat(cat);
          setPhotoModal(true);
        }
      } catch (e) {
        log.error("failed");
      }
    }
  };

  /**
   * Delete a cat (so it is no longer fostered)
   * @param catId
   */
  const handleDelete = async (
    e: SyntheticEvent,
    catId: string
  ): Promise<void> => {
    e.stopPropagation();
    log.info(catId);
    if (jwt) {
      try {
        const response = await deleteCat(jwt, catId);
        log.info(JSON.stringify(response));
        if (response.status < 299) {
          // Remove from displayed list
          setFosteredCats(fosteredCats.filter((c) => c.catId !== catId));
        }
      } catch (e) {
        log.error("failed");
      }
    }
  };

  /**
   * Shortcut if no fostered cats
   */
  if (fosteredCats.length === 0) {
    return <></>;
  }

  /**
   * Bring up the modal for editing the current cat
   * @param e
   */
  const handleEditCat = (e: SyntheticEvent, cat: Cat): void => {
    setCurrentCat(cat);
    setEditCatModal(true);
  };

  /**
   * Utility to render a single fostered cat
   * @param cat
   * @param idx
   */
  const fosteredCat = (cat: Cat, idx: number): React.ReactElement => {
    if (jwt) {
      const imageUrl = `${cat.pictureUrl}?nonce=${cat.nonce}`;
      checkIfExists(jwt, imageUrl);
      return (
        <tr key={cat.catId} onClick={(e): void => handleEditCat(e, cat)}>
          <td>{idx + 1}</td>
          <td>{cat.race}</td>
          <td>{cat.gender}</td>
          <td>{cat.age}</td>
          <td>{cat.name}</td>
          <td>{new Date(cat.createdAt).toLocaleDateString()}</td>
          <td>
            <img src={imageUrl} height={150} alt="" />
            <FontAwesomeIcon
              icon={faPencilAlt}
              size="lg"
              className="editIcon"
              color="blue"
              onClick={(e): Promise<void> => handleEditPhoto(e, cat)}
            />
          </td>
          <td>
            <FontAwesomeIcon
              icon={faTrash}
              size="lg"
              onClick={(e): Promise<void> => handleDelete(e, cat.catId)}
            />
          </td>
        </tr>
      );
    } else return <></>;
  };

  return (
    <>
      {editCatModal && currentCat && (
        // <></>
        <EditCatDetails
          jwt={jwt}
          fosteredCats={fosteredCats}
          setFosteredCats={setFosteredCats}
          modal={editCatModal}
          setModal={setEditCatModal}
          currentCat={currentCat}
          getCatsForUser={getCatsForUser}
        />
      )}

      {photoModal && signedUrl && currentCat && (
        <UploadCatImage
          jwt={jwt}
          fosteredCats={fosteredCats}
          setFosteredCats={setFosteredCats}
          modal={photoModal}
          setModal={setPhotoModal}
          signedUrl={signedUrl}
          currentCatId={currentCat.catId}
          getCatsForUser={getCatsForUser}
        />
      )}

      <Row>
        <Col>
          <hr />
        </Col>
      </Row>

      <Row>
        <Col>
          <h3>Your fostered cats</h3>
        </Col>
      </Row>

      <Row>
        <Table striped>
          <thead>
            <tr>
              <th>#</th>
              <th>Race</th>
              <th>Gender</th>
              <th>Age</th>
              <th>Name</th>
              <th>Date</th>
              <th>Picture</th>
              <th></th>
            </tr>
          </thead>
          <tbody>{fosteredCats.map((cat, idx) => fosteredCat(cat, idx))}</tbody>
        </Table>
      </Row>
    </>
  );
};

ListFosteredCats.propTypes = {
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
};

export default ListFosteredCats;
