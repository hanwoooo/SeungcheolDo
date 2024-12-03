import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { colors } from "@/constants";
import { getLineColor, StationData, StationInformation } from "@/types/domain";
import Icon from "react-native-vector-icons/MaterialIcons";
import SelectButton from "../Button/SelectButton";

interface StationBottomSheetProps {
  stationName: StationInformation;
  stationData: StationData;
  currentLine: string | null;
  setCurrentLine: (line: string | null) => void;
  bottomSheetRef: React.RefObject<BottomSheet>;
  snapPoints: string[];
  selectType: 'departure' | 'arrival' | null;
  onSelectStation: (type: 'departure' | 'arrival', stationName: string) => void;
}

function StationBottomSheet({
  stationName,
  stationData,
  currentLine,
  setCurrentLine,
  bottomSheetRef,
  snapPoints,
  selectType,
  onSelectStation,
}: StationBottomSheetProps) {
  const renderLineButtons = () => {
    if (!stationData?.connectedStations) return null;
    return stationData.connectedStations.map((lineConnection) => {
      const isActive = lineConnection.line === currentLine;
      return (
        <TouchableOpacity
          key={lineConnection.line}
          style={styles.lineButton}
          onPress={() => {
            const lineNumber = lineConnection.line;
            setCurrentLine(lineNumber);
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Icon
              name="circle"
              size={isActive ? 30 : 20}
              color={getLineColor(lineConnection.line)}
              style={{ marginRight: 10 }}
            />
            <Text
              style={[
                styles.lineButtonText,
                isActive && styles.activeLineButtonText,
              ]}
            >
              {lineConnection.line}호선
            </Text>
          </View>
        </TouchableOpacity>
      );
    });
  };

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={stationData ? 1 : -1}
      snapPoints={snapPoints}
      style={{
        borderRadius: 60,
        elevation: 24,
      }}
      backgroundStyle={{
        backgroundColor: colors.WHITE,
        borderWidth: 3,
        borderColor: colors.GRAY_200,
        borderRadius: 60,
      }}
    >
      <BottomSheetView style={styles.bottomSheetContent}>
        {stationData ? (
          <View style={styles.contentContainer}>
            <View style={styles.stationContainer}>
              <View
                style={[
                  styles.stationBar,
                  {
                    backgroundColor: currentLine
                      ? getLineColor(currentLine)
                      : getLineColor(stationData.connectedStations[0].line),
                  },
                ]}
              />
              <Text
                style={[
                  styles.stationName,
                  {
                    borderColor: currentLine
                      ? getLineColor(currentLine)
                      : getLineColor(stationData.connectedStations[0].line),
                  },
                ]}
              >
                {stationName.stationName}
              </Text>
            </View>

            <View style={styles.buttonContainer}>
              <View style={styles.lineButtonsContainer}>
                {renderLineButtons()}
              </View>
              <View style={styles.startButtonsContainer}>
                <SelectButton
                  text='출발'
                  isSelected={selectType === 'departure'}
                  onPress={() => {
                    if (onSelectStation && stationName) {
                      onSelectStation('departure', stationName.stationName);
                    }
                  }}
                />
                <SelectButton
                  text='도착'
                  isSelected={selectType === 'arrival'}
                  onPress={() => {
                    if (onSelectStation && stationName) {
                      onSelectStation('arrival', stationName.stationName);
                    }
                  }}
                />
              </View>
            </View>
            {currentLine && stationData?.connectedStations ? (
              <View style={styles.stationInfoContainer}>
                {stationData.connectedStations
                  .filter((lineConnection) => lineConnection.line === currentLine)
                  .flatMap((lineConnection) =>
                    lineConnection.connectedStationsInfo.map((stationInfo) => (
                      <View
                        key={`${lineConnection.line}-${stationInfo.stationName}`}
                        style={
                          stationInfo.direction === "previous"
                            ? styles.stationInfoBoxLeft
                            : styles.stationInfoBoxRight
                        }
                      >
                        <Text style={styles.stationInfoLabel}>{stationInfo.endStation}</Text>
                        <View
                          style={
                            stationInfo.direction === "previous"
                              ? styles.stationInfoRight
                              : styles.stationInfoLeft
                          }
                        >
                          <Text style={styles.stationInfoValue}>{stationInfo.stationName}</Text>
                        </View>
                      </View>
                    ))
                  )}
              </View>
            ) : (
              <Text>노선을 선택하세요.</Text>
            )}
          </View>
        ) : (
          <Text>정보가 없습니다. 검색 후 확인해주세요.</Text>
        )}
      </BottomSheetView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  stationContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  stationBar: {
    position: 'absolute',
    width: '90%',
    height: 25,
    borderRadius: 10,
    top: 20,
  },
  bottomSheetContent: {
    alignItems: "center",
    padding: 20,
  },
  contentContainer: {
    width: "100%",
    alignItems: "center",
  },
  stationName: {
    textAlign: "center",
    fontSize: 40,
    fontWeight: "bold",
    color: colors.BLACK,
    borderWidth: 3,
    paddingHorizontal: 30,
    paddingVertical: 5,
    borderRadius: 30,
    backgroundColor: colors.WHITE,
  },
  buttonContainer: {
    flexDirection: "row",
    marginBottom: 20,
    width: "100%",
    justifyContent: "space-between",
  },
  lineButtonsContainer: {
    flexDirection: "column",
    alignItems: "flex-start",
    paddingTop: 10,
    paddingLeft: 10,
  },
  startButtonsContainer: {
    flexDirection: "column",
    alignItems: "flex-end",
    paddingRight: 10,
  },
  lineButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginHorizontal: 5,
    marginBottom: 10,
  },
  lineButtonText: {
    fontSize: 14,
    color: colors.GRAY_500,
    marginBottom: 5,
  },
  activeLineButtonText: {
    color: colors.BLACK,
    fontWeight: "bold",
    fontSize: 20,
  },
  stationInfoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
  },
  stationInfoBoxLeft: {
    flex: 1,
    alignItems: "flex-end",
    padding: 10,
    borderWidth: 1,
    borderColor: colors.GRAY_500,
    borderRadius: 20,
    marginRight: 10,
  },
  stationInfoBoxRight: {
    flex: 1,
    alignItems: "flex-start",
    padding: 10,
    borderWidth: 1,
    borderColor: colors.GRAY_500,
    borderRadius: 20,
    marginLeft: 10,
  },
  stationInfoLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.GRAY_700,
    marginBottom: 5,
    paddingHorizontal: 10,
  },
  stationInfoRight: {
    width: "100%",
    borderTopWidth: 1,
    alignItems: "flex-end",
  },
  stationInfoLeft: {
    width: "100%",
    borderTopWidth: 1,
    alignItems: "flex-start",
  },
  stationInfoValue: {
    fontSize: 50,
    fontWeight: "bold",
    color: colors.BLACK,
    padding: 10,
    paddingHorizontal: 20,
  },
});

export default StationBottomSheet;
