package comtelekpsi.github.oviedofireandroid;

import android.content.Context;
import android.content.res.Resources;
import android.graphics.Color;
import android.util.TypedValue;
import android.view.Gravity;
import android.view.View;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;
import android.widget.ScrollView;
import android.widget.TableLayout;
import android.widget.TableRow;
import android.widget.TextView;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;

/**
 * Created by David on 9/9/2017.
 */

public class SubJSONParser {
    public static ArrayList<LinearLayout> subParse(String str, TableLayout mTableLayout, Context context, LinearLayout mLinearLayout, boolean isTablet, Resources r){
        mTableLayout.removeAllViews();
        ArrayList<LinearLayout> buttons = new ArrayList();
        try {
            JSONObject object = (JSONObject) new JSONObject(str);
            JSONArray sections = object.getJSONArray("list");
            for (int i=0; i<sections.length(); i++){

                TableRow tableRow = new TableRow(context);
                mTableLayout.addView(tableRow);
                TableLayout.LayoutParams rowParams = new TableLayout.LayoutParams(TableLayout.LayoutParams.MATCH_PARENT, TableLayout.LayoutParams.WRAP_CONTENT);
                tableRow.setLayoutParams(rowParams);
                TextView bRight = new TextView(context);
                JSONObject object2=sections.getJSONObject(i);
                String name=object2.getString("name");
                String cb=object2.getString("completedBy");
                if (!cb.equals("nobody")){
                    cb = "Completed by "+cb;
                    bRight.setText(cb);}
                String formId=object2.getString("formId");
                //Button button=new Button(context);
                //RelativeLayout button = new RelativeLayout(context);
                LinearLayout button = new LinearLayout(context);
                button.setId(View.generateViewId());
                TextView bLeft= new TextView(context);
                bLeft.setId(View.generateViewId());
                button.addView(bLeft);
                button.addView(bRight);
                buttons.add(button);
                bLeft.setText(name);
                button.setBackgroundColor(Color.BLACK);
                bLeft.setTextColor(Color.WHITE);
                bRight.setTextColor(Color.WHITE);
                button.setTag(formId);
                System.out.println(button.getTag());
                tableRow.addView(button);
                TableRow.LayoutParams buttonParams = new TableRow.LayoutParams(TableRow.LayoutParams.MATCH_PARENT, TableRow.LayoutParams.WRAP_CONTENT);
                float pxLeftMargin = TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, 0, r.getDisplayMetrics());
                float pxRightMargin = TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, 0, r.getDisplayMetrics());
                float pxTopMargin = TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, 1, r.getDisplayMetrics());
                float pxBottomMargin = TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, 1, r.getDisplayMetrics());
                buttonParams.setMargins(Math.round(pxLeftMargin), Math.round(pxTopMargin), Math.round(pxRightMargin), Math.round(pxBottomMargin));
                button.setLayoutParams(buttonParams);
                int width=mLinearLayout.getWidth();
                System.out.println("thisisthewidth"+width);
                //RelativeLayout.LayoutParams relParamLeft= new RelativeLayout.LayoutParams(RelativeLayout.LayoutParams.MATCH_PARENT, RelativeLayout.LayoutParams.MATCH_PARENT);
                //relParamLeft.addRule(RelativeLayout.ALIGN_PARENT_LEFT);
                pxTopMargin = TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, 10, r.getDisplayMetrics());
                pxBottomMargin = TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, 10, r.getDisplayMetrics());
                LinearLayout.LayoutParams relParamLeft= new LinearLayout.LayoutParams(width/2, LinearLayout.LayoutParams.WRAP_CONTENT,1);
                relParamLeft.setMargins(Math.round(pxLeftMargin), Math.round(pxTopMargin), Math.round(pxRightMargin), Math.round(pxBottomMargin));
                //RelativeLayout.LayoutParams relParamRight= new RelativeLayout.LayoutParams(RelativeLayout.LayoutParams.MATCH_PARENT, RelativeLayout.LayoutParams.MATCH_PARENT);
                //relParamRight.addRule(RelativeLayout.ALIGN_PARENT_RIGHT);
                LinearLayout.LayoutParams relParamRight= new LinearLayout.LayoutParams(width/2, LinearLayout.LayoutParams.WRAP_CONTENT,1);
                relParamRight.setMargins(Math.round(pxLeftMargin), Math.round(pxTopMargin), Math.round(pxRightMargin), Math.round(pxBottomMargin));
                //relParamRight.addRule(RelativeLayout.ALIGN_RIGHT, bLeft.getId());
                //relParamRight.addRule(LinearLayout);


                bLeft.setLayoutParams(relParamLeft);
                bRight.setLayoutParams(relParamRight);
                bRight.setGravity(Gravity.RIGHT);
                bLeft.setTextSize(16);
                bRight.setTextSize(12);
                if(isTablet)bLeft.setTextSize(30);
                if(isTablet)bRight.setTextSize(22);
            }
        } catch (JSONException e) {
            // Appropriate error handling code
        }
        return buttons;
    }
}
